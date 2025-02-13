<template>
    <div class="space-y-6">
        <div class="border-b border-gray-200">
            <nav class="flex space-x-8" aria-label="Tabs">
                <button v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab.id)" :class="[
                    activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]">
                    {{ tab.name }}
                </button>
            </nav>
        </div>

        <div class="mt-6">
            <div v-if="activeTab === 'details'" class="space-y-6">
                <slot name="details"></slot>
            </div>

            <div v-if="activeTab === 'zusatzleistungen'" class="space-y-6">
                <slot name="zusatzleistungen"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('details');

const tabs = [
    { id: 'details', name: 'Details' },
    { id: 'zusatzleistungen', name: 'Zusatzleistungen' }
];

const setActiveTab = (tabId) => {
    activeTab.value = tabId;
};
</script>