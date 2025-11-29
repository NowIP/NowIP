<script setup lang="ts">
import type { GetDomainsResponse } from '~/api-client';
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { DomainStore } from '~/utils/stores/domainStore';


useSeoMeta({
    title: 'Domains | NowIP',
    description: 'Manage your domains'
});

const toast = useToast();

type Domain = GetDomainsResponse["data"][0];

let domains = await DomainStore.use();

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<Domain>[] = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'subdomain',
        header: 'Domain',
        cell: ({ row }) => {
            const subdomain = row.getValue('subdomain') as string;
            const fullDomain = getFullDomain(subdomain);
            return fullDomain;
            
        }
    },
    {
        accessorKey: 'last_ipv4',
        header: 'Current IPv4',
        cell: ({ row }) => row.getValue('last_ipv4') || 'N/A'
    },
        {
        accessorKey: 'last_ddns_update',
        header: 'Last DDNS Update',
        cell: ({ row }) => {
            if (!row.getValue('last_ddns_update')) {
                return 'Never'
            }
            return new Date(row.getValue('last_ddns_update')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    {
        accessorKey: "last_ipv6",
        header: 'Current IPv6',
        cell: ({ row }) => row.getValue('last_ipv6') || 'N/A'
    }
]

</script>

<template>
    <UDashboardPanel id="home" :ui="{ body: 'lg:py-12' }">
        <template #header>
            <UDashboardNavbar title="Manage Domains">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>

        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-6xl mx-auto">
                <UTable :data="domains" :columns="columns" class="flex-1" />
            </div>
        </template>

    </UDashboardPanel>
</template>