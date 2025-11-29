import * as api from "@/api-client";

export function useAPI(disableAuthRedirect = false) {

    const sessionToken = useCookie("session_token");

    if (sessionToken.value) {
        updateAPIClient(sessionToken.value);
    } else {
        updateAPIClient(null);
        if (import.meta.client && !disableAuthRedirect) {
            navigateTo('/auth/login?url=' + encodeURIComponent(useRoute().fullPath));
        }
    }

    return api;
}