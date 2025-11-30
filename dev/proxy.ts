import { defineEventHandler, getRequestURL, sendError, createError, proxyRequest } from 'h3';

const target = process.env.PROXY_TARGET ?? 'https://api.nowip.is-on.net';

export default defineEventHandler(async (event) => {
    if (process.env.NODE_ENV !== 'development' || process.env.USE_DEV_PROXY !== 'true') {
        throw createError({ statusCode: 403, statusMessage: 'Proxy only runs in development.' });
    }

    const url = getRequestURL(event);
    const path = url.pathname.replace(/^\/api\/proxy/, '') || '/';

    try {
        return await proxyRequest(event, target + path, { fetchOptions: { headers: event.headers } });
    } catch (err: any) {
        sendError(event, createError({ statusCode: 502, statusMessage: `Dev proxy error: ${err.message}` }));
    }
});
