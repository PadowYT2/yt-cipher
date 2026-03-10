import crypto from 'node:crypto';
import { mkdir, readdir, stat, utimes } from 'node:fs/promises';
import { join } from 'node:path';
import Bun from 'bun';
import { cacheSize, playerScriptFetches } from '@/metrics';
import { PlayerScript } from '@/player';

const ignorePlayerScriptRegion = Bun.env.IGNORE_SCRIPT_REGION === 'true';

const resolveCacheHome = () => {
    if (Bun.env.XDG_CACHE_HOME) return Bun.env.XDG_CACHE_HOME;
    if (Bun.env.LOCALAPPDATA) return Bun.env.LOCALAPPDATA;

    const home =
        Bun.env.HOME ??
        Bun.env.USERPROFILE ??
        (Bun.env.HOMEDRIVE && Bun.env.HOMEPATH && `${Bun.env.HOMEDRIVE}${Bun.env.HOMEPATH}`) ??
        undefined;

    if (home) return join(home, '.cache');

    // last resort
    return join(process.cwd(), '.cache');
};

export const CACHE_HOME = resolveCacheHome();
export const CACHE_DIR = Bun.env.CACHE_DIRECTORY ?? join(CACHE_HOME, 'yt-cipher', 'player_cache');

export async function getPlayerFilePath(playerScript: PlayerScript): Promise<string> {
    const playerUrl = playerScript.toUrl();
    let cacheKey: string;
    if (ignorePlayerScriptRegion) {
        // I have not seen any scripts that differ between regions so this should be safe
        cacheKey = playerScript.id;
    } else {
        // This hash of the player script url will mean that diff region scripts are treated as unequals, even for the same version #
        // I dont think I have ever seen 2 scripts of the same version differ between regions but if they ever do this will catch it
        // As far as player script access, I haven't ever heard about YT ratelimiting those either so ehh
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(playerUrl));
        cacheKey = Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    }
    const filePath = join(CACHE_DIR, `${cacheKey}.js`);

    try {
        const fileStat = await stat(filePath);
        // updated time on file mark it as recently used.
        await utimes(filePath, new Date(), fileStat.mtime ?? new Date());
        return filePath;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`Cache miss for player: ${playerUrl}. Fetching...`);
            const response = await fetch(playerUrl);
            playerScriptFetches.labels({ player_url: playerUrl, status: String(response.status) }).inc();
            if (!response.ok) {
                throw new Error(`Failed to fetch player from ${playerUrl}: ${response.statusText}`);
            }
            const playerContent = await response.text();
            await Bun.write(filePath, playerContent);

            // Update cache size for metrics
            const files = await readdir(CACHE_DIR);
            cacheSize.labels({ cache_name: 'player' }).set(files.length);

            console.log(`Saved player to cache: ${filePath}`);
            return filePath;
        }
        throw error;
    }
}

export async function initializeCache() {
    await mkdir(CACHE_DIR, { recursive: true });

    // Since these accumulate over time just cleanout 14 day unused ones
    let fileCount = 0;
    const thirtyDays = 14 * 24 * 60 * 60 * 1000;
    console.log(`Cleaning up player cache directory: ${CACHE_DIR}`);
    for (const dirEntry of await readdir(CACHE_DIR, { withFileTypes: true })) {
        if (dirEntry.isFile()) {
            const filePath = join(CACHE_DIR, dirEntry.name);
            const fileStat = await stat(filePath);
            const lastAccessed =
                fileStat.atime?.getTime() ?? fileStat.mtime?.getTime() ?? fileStat.birthtime?.getTime();
            if (lastAccessed && Date.now() - lastAccessed > thirtyDays) {
                console.log(`Deleting stale player cache file: ${filePath}`);
                await Bun.file(filePath).delete();
            } else {
                fileCount++;
            }
        }
    }
    cacheSize.labels({ cache_name: 'player' }).set(fileCount);
    console.log(`Player cache directory ensured at: ${CACHE_DIR}`);
}
