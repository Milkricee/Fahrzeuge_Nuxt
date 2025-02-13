<template>
  <form @submit.prevent="submitForm">
    <div v-if="showForm" class="space-y-4">
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Datum *</label>
        <input type="date" v-model="formData.datum"
          class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required />
      </div>

      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Beschreibung *</label>
        <textarea v-model="formData.beschreibung"
          class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="3" required placeholder="Beschreiben Sie die Reparatur"></textarea>
      </div>

      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Kilometerstand *</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input type="number" v-model.number="formData.kilometerstand"
            class="pl-2 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required min="0" placeholder="0" />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">km</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Kosten *</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">€</span>
          </div>
          <input type="number" v-model.number="formData.kosten"
            class="pl-6 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required min="0" step="0.01" placeholder="0.00" />
        </div>
      </div>

      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Status *</label>
        <select v-model="formData.status"
          class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required>
          <option value="offen">Offen</option>
          <option value="abgeschlossen">Abgeschlossen</option>
        </select>
      </div>
      <p class="text-sm text-gray-500 mt-2">* Pflichtfelder</p>
    </div>
  </form>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';

const emit = defineEmits(['save']);

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
});

const showForm = ref(props.activeTab === 'Reparaturen'); 

watch(
  () => props.activeTab,
  (newTab) => {
    showForm.value = newTab === 'Reparaturen';
  }
);

const submitForm = () => {
  emit('save', { ...props.formData });
};
</script>