import crypto from 'node:crypto';
import { mkdir, readdir, stat, utimes } from 'node:fs/promises';
import { join } from 'node:path';
import Bun from 'bun';
import { cacheSize, playerScriptFetches } from '@/metrics';

export const CACHE_DIR = join(Bun.env.CACHE_DIRECTORY ?? process.cwd(), 'player_cache');

export async function getPlayerFilePath(playerUrl: string): Promise<string> {
    // This hash of the player script url will mean that diff region scripts are treated as unequals, even for the same version #
    // I dont think I have ever seen 2 scripts of the same version differ between regions but if they ever do this will catch it
    // As far as player script access, I haven't ever heard about YT ratelimiting those either so ehh
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(playerUrl));
    const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    const filePath = join(CACHE_DIR, `${hash}.js`);

    try {
        const fileStat = await stat(filePath);
        // updated time on file mark it as recently used.
        await utimes(filePath, new Date(), fileStat.mtime ?? new Date());
        return filePath;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`Cache miss for player: ${playerUrl}. Fetching...`);
            const response = await fetch(playerUrl);
            playerScriptFetches.labels({ player_url: playerUrl, status: response.statusText }).inc();
            if (!response.ok) {
                throw new Error(`Failed to fetch player from ${playerUrl}: ${response.statusText}`);
            }
            const playerContent = await response.text();
            await Bun.file(filePath).write(playerContent);

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
