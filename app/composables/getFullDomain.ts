
export function getFullDomain(domain: string) {

    const baseDomain = useRuntimeConfig().public.baseDNSDomain;

    if (domain.endsWith(`.${baseDomain}`)) {
        return domain;
    }

    return `${domain}.${baseDomain}`;
}
