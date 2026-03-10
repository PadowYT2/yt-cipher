import Bun from 'bun';
import { getFromPrepared } from 'ejs/src/yt/solver/solvers';
import { workerErrors } from '@/metrics';
import { PlayerScript } from '@/player';
import { getPlayerFilePath } from '@/playerCache';
import { preprocessedCache } from '@/preprocessedCache';
import { solverCache } from '@/solverCache';
import { Solvers } from '@/types';
import { execInPool } from '@/workerPool';

export async function getSolvers(playerScript: PlayerScript): Promise<Solvers | null> {
    const playerCacheKey = await getPlayerFilePath(playerScript);

    let solvers = solverCache.get(playerCacheKey);

    if (solvers) {
        return solvers;
    }

    let preprocessedPlayer = preprocessedCache.get(playerCacheKey);
    if (!preprocessedPlayer) {
        const rawPlayer = await Bun.file(playerCacheKey).text();
        try {
            preprocessedPlayer = await execInPool(rawPlayer);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            workerErrors.labels({ player_id: playerScript.id, player_type: playerScript.variant, message }).inc();
            throw e;
        }
        preprocessedCache.set(playerCacheKey, preprocessedPlayer);
    }

    solvers = getFromPrepared(preprocessedPlayer);
    if (solvers) {
        solverCache.set(playerCacheKey, solvers);
        return solvers;
    }

    return null;
}
