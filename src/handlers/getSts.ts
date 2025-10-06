import Bun from 'bun';
import { getPlayerFilePath } from '@/playerCache';
import { stsCache } from '@/stsCache';
import { RequestContext, StsRequest, StsResponse } from '@/types';

export async function handleGetSts(ctx: RequestContext): Promise<Response> {
    const { player_url } = ctx.body as StsRequest;
    const playerFilePath = await getPlayerFilePath(player_url);

    const cachedSts = stsCache.get(playerFilePath);
    if (cachedSts) {
        const response: StsResponse = { sts: cachedSts };
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'X-Cache-Hit': 'true' },
        });
    }

    const playerContent = await Bun.file(playerFilePath).text();

    const stsPattern = /(signatureTimestamp|sts):(\d+)/;
    const match = playerContent.match(stsPattern);

    if (match?.[2]) {
        const sts = match[2];
        stsCache.set(playerFilePath, sts);
        const response: StsResponse = { sts };
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'X-Cache-Hit': 'false' },
        });
    } else {
        return new Response(JSON.stringify({ error: 'Timestamp not found in player script' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
