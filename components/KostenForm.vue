<template>
    <form @submit.prevent="submitForm">
      <div v-if="activeTab === 'Kosten'" class="space-y-4">
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700">Datum *</label>
          <input type="date" v-model="formData.datum"
            class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required />
        </div>
  
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700">Kategorie *</label>
          <select v-model="formData.kategorie"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required>
            <option value="Versicherung">Versicherung</option>
            <option value="Kraftstoff">Kraftstoff</option>
            <option value="Steuer">Steuer</option>
            <option value="Wartung">Wartung</option>
            <option value="Reparatur">Reparatur</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>
  
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea v-model="formData.beschreibung"
            class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="2" placeholder="Zusätzliche Informationen (optional)"></textarea>
        </div>
  
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700">Betrag *</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">€</span>
            </div>
            <input type="number" v-model.number="formData.betrag"
              class="pl-6 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required min="0" step="0.01" placeholder="0.00" />
          </div>
        </div>
  
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700">Beleg-Nr.</label>
          <input type="text" v-model="formData.beleg_nr"
            class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Optional" />
        </div>
        <p class="text-sm text-gray-500 mt-2">* Pflichtfelder</p>
      </div>
    </form>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
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
  
  const submitForm = () => {
    emit('save', { ...props.formData });
  };
  </script>