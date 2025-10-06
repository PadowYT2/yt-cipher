import Bun from 'bun';
import { handleDecryptSignature } from '@/handlers/decryptSignature';
import { handleGetSts } from '@/handlers/getSts';
import { registry } from '@/metrics';
import { withMetrics, withPlayerUrlValidation } from '@/middleware';
import { initializeCache } from '@/playerCache';
import { ApiRequest, RequestContext } from '@/types';
import { initializeWorkers } from '@/workerPool';

const API_TOKEN = Bun.env.API_TOKEN;

async function baseHandler(req: Request): Promise<Response> {
    const { pathname } = new URL(req.url);

    if (req.method === 'GET' && pathname === '/') {
        return new Response(
            'There is no endpoint here, you can read the API spec at https://github.com/kikkia/yt-cipher?tab=readme-ov-file#api-specification. If you are using yt-source/lavalink, use this url for your remote cipher url',
            {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
            },
        );
    }

    if (pathname === '/metrics') {
        return new Response(await registry.metrics(), {
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    const authHeader = req.headers.get('authorization');
    if (API_TOKEN && API_TOKEN !== '') {
        if (authHeader !== API_TOKEN) {
            const error = authHeader ? 'Invalid API token' : 'Missing API token';
            return new Response(JSON.stringify({ error }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    let handle: (ctx: RequestContext) => Promise<Response>;

    if (pathname === '/decrypt_signature') {
        handle = handleDecryptSignature;
    } else if (pathname === '/get_sts') {
        handle = handleGetSts;
    } else {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const body = (await req.json()) as ApiRequest;
    const ctx: RequestContext = { req, body };

    const composedHandler = withMetrics(withPlayerUrlValidation(handle));
    return await composedHandler(ctx);
}

const handler = baseHandler;

const port = Bun.env.PORT || 8001;
const host = Bun.env.HOST || '0.0.0.0';

await initializeCache();
initializeWorkers();

console.log(`Server listening on http://${host}:${port}`);
Bun.serve({
    fetch: handler,
    port: Number(port),
    hostname: host,
});
