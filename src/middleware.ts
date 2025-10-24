import { endpointHits, endpointLatency, playerUrlRequests, responseCodes } from '@/metrics';
import { RequestContext } from '@/types';
import { extractPlayerId, validateAndNormalizePlayerUrl } from '@/utils';

type Next = (ctx: RequestContext) => Promise<Response>;

export function withMetrics(handler: Next): Next {
    return async (ctx: RequestContext) => {
        const { pathname } = new URL(ctx.req.url);
        const playerId = extractPlayerId(ctx.body.player_url);
        const pluginVersion = ctx.req.headers.get('Plugin-Version') ?? 'unknown';
        const userAgent = ctx.req.headers.get('User-Agent') ?? 'unknown';

        endpointHits
            .labels({
                method: ctx.req.method,
                pathname,
                player_id: playerId,
                plugin_version: pluginVersion,
                user_agent: userAgent,
            })
            .inc();
        const start = performance.now();

        let response: Response;
        try {
            response = await handler(ctx);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            response = new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const duration = (performance.now() - start) / 1000;
        const cached = response.headers.get('X-Cache-Hit') === 'true' ? 'true' : 'false';
        endpointLatency.labels({ method: ctx.req.method, pathname, player_id: playerId, cached }).observe(duration);
        responseCodes
            .labels({
                method: ctx.req.method,
                pathname,
                status: String(response.status),
                player_id: playerId,
                plugin_version: pluginVersion,
                user_agent: userAgent,
            })
            .inc();

        return response;
    };
}

export function withPlayerUrlValidation(handler: Next): Next {
    return async (ctx: RequestContext) => {
        if (!ctx.body.player_url) {
            return new Response(JSON.stringify({ error: 'player_url is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const normalizedUrl = validateAndNormalizePlayerUrl(ctx.body.player_url);
        const playerId = extractPlayerId(normalizedUrl);
        playerUrlRequests.labels({ player_id: playerId }).inc();

        // Mutate the context with the normalized URL
        ctx.body.player_url = normalizedUrl;

        return await handler(ctx);
    };
}
