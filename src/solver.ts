import Bun from 'bun';
import { getFromPrepared } from 'ejs/src/yt/solver/solvers';
import { workerErrors } from '@/metrics';
import { getPlayerFilePath } from '@/playerCache';
import { preprocessedCache } from '@/preprocessedCache';
import { solverCache } from '@/solverCache';
import { Solvers } from '@/types';
import { extractPlayerId } from '@/utils';
import { execInPool } from '@/workerPool';

export async function getSolvers(player_url: string): Promise<Solvers | null> {
    const playerCacheKey = await getPlayerFilePath(player_url);

    let solvers = solverCache.get(playerCacheKey);

    if (solvers) {
        return solvers;
    }

    let preprocessedPlayer = preprocessedCache.get(playerCacheKey);
    if (!preprocessedPlayer) {
        const rawPlayer = await Bun.file(playerCacheKey).text();
        preprocessedPlayer = await execInPool(rawPlayer);
        try {
            preprocessedPlayer = await execInPool(rawPlayer);
        } catch (e) {
            const playerId = extractPlayerId(player_url);
            const message = e instanceof Error ? e.message : String(e);
            workerErrors.labels({ player_id: playerId, message }).inc();
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
