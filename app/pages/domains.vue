<script setup lang="ts">
import type { GetDomainsResponse } from '~/api-client';


useSeoMeta({
    title: 'Domains | NowIP',
    description: 'Manage your domains'
});

const toast = useToast();

let domains = reactive([] as GetDomainsResponse["data"]);
try {
    const response = await useAPI().getDomains({});
    if (response.success) {

        domains.push(...response.data);
        
    } else {
        toast.add({
            title: 'Error',
            description: response.message || 'An error occurred while fetching domains.',
            icon: 'i-lucide-alert-circle',
            color: 'error'
        });
    }
} catch (error) {
    toast.add({
        title: 'Error',
        description: 'An error occurred while fetching domains.',
        icon: 'i-lucide-alert-circle',
        color: 'error'
    });
}

</script>

<template>
    <UDashboardPanel id="home">
        <template #header>
            <UDashboardNavbar title="Manage Domains" :ui="{ right: 'gap-3' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>

        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                {{ domains }}
            </div>
        </template>

    </UDashboardPanel>
</template>