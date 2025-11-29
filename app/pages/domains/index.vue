<script setup lang="ts">
import type { GetDomainsResponse } from '~/api-client';
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
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
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
            return new Date(row.getValue('date')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const color = {
                paid: 'success' as const,
                failed: 'error' as const,
                refunded: 'neutral' as const
            }[row.getValue('status') as string]

            return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                row.getValue('status')
            )
        }
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'amount',
        header: () => h('div', { class: 'text-right' }, 'Amount'),
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('amount'))

            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount)

            return h('div', { class: 'text-right font-medium' }, formatted)
        }
    },
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