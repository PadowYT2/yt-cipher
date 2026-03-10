import { playerUrlRequests } from '@/metrics';
import { getPlayerScript } from '@/player';
import type { RequestContext, WithPlayerContext } from '@/types';

type Next = (ctx: RequestContext) => Promise<Response>;
type PlayerNext = (ctx: WithPlayerContext) => Promise<Response>;

export function withPlayer(handler: PlayerNext): Next {
    return async (ctx: RequestContext) => {
        try {
            const playerScript = getPlayerScript(ctx.body.player_url);
            playerUrlRequests.labels({ player_id: playerScript.id, player_type: playerScript.variant }).inc();
            const newCtx = { ...ctx, playerScript };
            return await handler(newCtx);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            return new Response(JSON.stringify({ error: `Player script error: ${message}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    };
}
