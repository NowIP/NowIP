import type PBClient from "pocketbase";

export async function usePBData<TReturn>(handler: (pb: PBClient) => TReturn) {
    const { data } = await useAsyncData(async (nuxtApp) => {
        const pb = nuxtApp.$pb;
        if (!pb) {
            throw new Error("PocketBase client is not available");
        }
        return handler(pb);
    });
    return data;
}