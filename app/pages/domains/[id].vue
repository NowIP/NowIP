<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const domainID = useRoute().params.id as string;

const domain = await useAPI().getDomainsDomainId({
    ignoreResponseError: true,
    path: { domainID }
});

if (!domain.success) {
    throw createError({ statusCode: domain.code, statusMessage: domain.message });
}

// add shared reactive domain data for domain management pages

const links = [[{
    label: 'General',
    icon: 'i-lucide-user',
    to: `/domains/${domainID}`,
    exact: true
}, {
    label: 'DNS Records',
    icon: 'i-lucide-database',
    to: `/domains/${domainID}/dns-records`
}, {
    label: 'Danger Zone',
    icon: 'i-lucide-shield',
    to: `/domains/${domainID}/danger-zone`
}]] satisfies NavigationMenuItem[][]

</script>

<template>
    <UDashboardPanel id="manage-domain-${id}" :ui="{ body: 'lg:py-12' }">
        <template #header>
            <UDashboardNavbar title="Settings">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>

            <UDashboardToolbar>
                <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
                <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
            </UDashboardToolbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <NuxtPage />
            </div>
        </template>
    </UDashboardPanel>
</template>
