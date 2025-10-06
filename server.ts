import Bun from 'bun';
import { Elysia, t } from 'elysia';
import { handleDecryptSignature } from '@/handlers/decryptSignature';
import { handleGetSts } from '@/handlers/getSts';
import { registry } from '@/metrics';
import { withMetrics, withPlayerUrlValidation } from '@/middleware';
import { initializeCache } from '@/playerCache';
import { initializeWorkers } from '@/workerPool';

const API_TOKEN = Bun.env.API_TOKEN;

await initializeCache();
initializeWorkers();

const app = new Elysia()
    // @ts-expect-error
    .onBeforeHandle(({ request, status }) => {
        const authHeader = request.headers.get('authorization');
        if (API_TOKEN && authHeader !== API_TOKEN) {
            return status(401, { error: authHeader ? 'Invalid API token' : 'Missing API token' });
        }
    })
    .get(
        '/',
        () =>
            'There is no endpoint here, you can read the API spec at https://github.com/kikkia/yt-cipher?tab=readme-ov-file#api-specification. If you are using yt-source/lavalink, use this url for your remote cipher url',
    )
    .get('/metrics', async () => {
        return new Response(await registry.metrics(), { headers: { 'Content-Type': 'text/plain' } });
    })
    .post(
        '/decrypt_signature',
        async ({ body, request }) => {
            const ctx = { req: request, body };
            const handler = withPlayerUrlValidation(handleDecryptSignature);
            return withMetrics(handler)(ctx);
        },
        { body: t.Object({ player_url: t.String(), signature_timestamp: t.Number() }) },
    )
    .post(
        '/get_sts',
        async ({ body, request }) => {
            const ctx = { req: request, body };
            const handler = withPlayerUrlValidation(handleGetSts);
            return withMetrics(handler)(ctx);
        },
        { body: t.Object({ player_url: t.String() }) },
    )
    .listen({
        port: Bun.env.PORT || 8001,
        hostname: Bun.env.HOST || '0.0.0.0',
    });

console.log(`Server listening on http://${app.server?.hostname}:${app.server?.port}`);
