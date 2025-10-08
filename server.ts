import Bun from 'bun';
import { Elysia, t } from 'elysia';
import { handleDecryptSignature } from '@/handlers/decryptSignature';
import { handleGetSts } from '@/handlers/getSts';
import { handleResolveUrl } from '@/handlers/resolveUrl';
import { registry } from '@/metrics';
import { withMetrics, withPlayerUrlValidation } from '@/middleware';
import { initializeCache } from '@/playerCache';
import { initializeWorkers } from '@/workerPool';

const API_TOKEN = Bun.env.API_TOKEN;
const DISABLE_METRICS = Boolean(Bun.env.DISABLE_METRICS);

await initializeCache();
initializeWorkers();

const app = new Elysia()
    .get(
        '/',
        () =>
            'There is no endpoint here, you can read the API spec at https://github.com/kikkia/yt-cipher?tab=readme-ov-file#api-specification. If you are using yt-source/lavalink, use this url for your remote cipher url',
    )
    // @ts-expect-error
    .onBeforeHandle(({ request, status }) => {
        const authHeader = request.headers.get('authorization');
        if (API_TOKEN && authHeader !== API_TOKEN) {
            return status(401, { error: authHeader ? 'Invalid API token' : 'Missing API token' });
        }
    })
    .get('/metrics', async ({ status }) => {
        if (DISABLE_METRICS) {
            return status(404, 'NOT_FOUND');
        }
        return new Response(await registry.metrics(), { headers: { 'Content-Type': 'text/plain' } });
    })
    .post(
        '/decrypt_signature',
        async ({ body, request }) => {
            const ctx = { req: request, body };
            const handler = withPlayerUrlValidation(handleDecryptSignature);
            if (DISABLE_METRICS) {
                return handler(ctx);
            }
            return withMetrics(handler)(ctx);
        },
        { body: t.Object({ player_url: t.String(), encrypted_signature: t.String(), n_param: t.String() }) },
    )
    .post(
        '/get_sts',
        async ({ body, request }) => {
            const ctx = { req: request, body };
            const handler = withPlayerUrlValidation(handleGetSts);
            if (DISABLE_METRICS) {
                return handler(ctx);
            }
            return withMetrics(handler)(ctx);
        },
        { body: t.Object({ player_url: t.String() }) },
    )
    .post(
        '/resolve_url',
        async ({ body, request }) => {
            const ctx = { req: request, body };
            const handler = withPlayerUrlValidation(handleResolveUrl);
            if (DISABLE_METRICS) {
                return handler(ctx);
            }
            return withMetrics(handler)(ctx);
        },
        {
            body: t.Object({
                stream_url: t.String(),
                player_url: t.String(),
                encrypted_signature: t.String(),
                signature_key: t.Optional(t.String()),
                n_param: t.Optional(t.String()),
            }),
        },
    )
    .listen({
        port: Bun.env.PORT || 8001,
        hostname: Bun.env.HOST || '0.0.0.0',
    });

console.log(`Server listening on http://${app.server?.hostname}:${app.server?.port}`);