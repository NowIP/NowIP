<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

type Payment = {
    id: string
    date: string
    status: 'paid' | 'failed' | 'refunded'
    email: string
    amount: number
}

const data = ref<Payment[]>([{
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594
}])

const columns: TableColumn<Payment>[] = [{
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false
}, {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
}, {
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
}, {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const color = ({
            paid: 'success' as const,
            failed: 'error' as const,
            refunded: 'neutral' as const
        })[row.getValue('status') as string]

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
    }
}, {
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
}, {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
        const items = [{
            type: 'label',
            label: 'Actions'
        }, {
            label: 'Copy payment ID',
            onSelect() {
                copy(row.original.id)

                toast.add({
                    title: 'Payment ID copied to clipboard!',
                    color: 'success',
                    icon: 'i-lucide-circle-check'
                })
            }
        }, {
            label: row.getIsExpanded() ? 'Collapse' : 'Expand',
            onSelect() {
                row.toggleExpanded()
            }
        }, {
            type: 'separator'
        }, {
            label: 'View customer'
        }, {
            label: 'View payment details'
        }]

        return h('div', { class: 'text-right' }, h(UDropdownMenu, {
            'content': {
                align: 'end'
            },
            items,
            'aria-label': 'Actions dropdown'
        }, () => h(UButton, {
            'icon': 'i-lucide-ellipsis-vertical',
            'color': 'neutral',
            'variant': 'ghost',
            'class': 'ml-auto',
            'aria-label': 'Actions dropdown'
        })))
    }
}]

const table = useTemplateRef('table')

function randomize() {
    data.value = [...data.value].sort(() => Math.random() - 0.5)
}
</script>

<template>
    <UDashboardPanel id="customers">
        <template #header>
            <UDashboardNavbar title="Customers">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex-1 divide-y divide-accented w-full">
                <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
                    <UInput :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
                        class="max-w-sm min-w-[12ch]" placeholder="Filter emails..."
                        @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)" />

                    <UButton color="neutral" label="Randomize" @click="randomize" />

                    <UDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
                        label: upperFirst(column.id),
                        type: 'checkbox' as const,
                        checked: column.getIsVisible(),
                        onUpdateChecked(checked: boolean) {
                            table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                        },
                        onSelect(e: Event) {
                            e.preventDefault()
                        }
                    }))" :content="{ align: 'end' }">
                        <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down"
                            class="ml-auto" aria-label="Columns select dropdown" />
                    </UDropdownMenu>
                </div>

                <UTable ref="table" :data="data" :columns="columns" sticky class="h-96">
                    <template #expanded="{ row }">
                        <pre>{{ row.original }}</pre>
                    </template>
                </UTable>

                <div class="px-4 py-3.5 text-sm text-muted">
                    {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
                    {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>