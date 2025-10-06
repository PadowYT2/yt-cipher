import Bun from 'bun';
import { getFromPrepared } from 'ejs/src/yt/solver/solvers';
import { getPlayerFilePath } from '@/playerCache';
import { preprocessedCache } from '@/preprocessedCache';
import { solverCache } from '@/solverCache';
import { RequestContext, SignatureRequest, SignatureResponse } from '@/types';
import { execInPool } from '@/workerPool';

export async function handleDecryptSignature(ctx: RequestContext): Promise<Response> {
    const { encrypted_signature, n_param, player_url } = ctx.body as SignatureRequest;

    const playerCacheKey = await getPlayerFilePath(player_url);

    let solvers = solverCache.get(playerCacheKey);

    if (!solvers) {
        let preprocessedPlayer = preprocessedCache.get(playerCacheKey);
        if (!preprocessedPlayer) {
            const rawPlayer = await Bun.file(playerCacheKey).text();
            preprocessedPlayer = await execInPool(rawPlayer);
            preprocessedCache.set(playerCacheKey, preprocessedPlayer);
        }

        solvers = getFromPrepared(preprocessedPlayer);
        solverCache.set(playerCacheKey, solvers);
    }

    let decrypted_signature = '';
    if (encrypted_signature && solvers.sig) {
        decrypted_signature = solvers.sig(encrypted_signature);
    }

    let decrypted_n_sig = '';
    if (n_param && solvers.n) {
        decrypted_n_sig = solvers.n(n_param);
    }

    const response: SignatureResponse = {
        decrypted_signature,
        decrypted_n_sig,
    };

    return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
