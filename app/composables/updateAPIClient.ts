import { client } from "@/api-client/client.gen";

export function updateAPIClient(token: string | null) {

    const apiURL = useRuntimeConfig().public.apiUrl;
    console.log("Updating API client., token:", token, "apiURL:", apiURL);
    if (token) {
        client.setConfig({
            baseURL: apiURL,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        client.setConfig({
            baseURL: apiURL
        });
    }
}