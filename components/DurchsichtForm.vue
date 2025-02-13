<template>
  <form @submit.prevent="submitForm">
    <div v-if="activeTab === 'Durchsicht'" class="space-y-4">
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Datum *</label>
        <input type="date" v-model="formData.datum"
          class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required />
      </div>

      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Kilometerstand *</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input type="number" v-model.number="formData.km"
            class="pl-2 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" required
            min="0" placeholder="0" />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">km</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">Anmerkungen</label>
        <textarea v-model="formData.anmerkungen"
          class="pl-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="3" placeholder="Optionale Anmerkungen zur Durchsicht"></textarea>
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
  if (!props.formData.datum) {
    alert("Bitte ein gültiges Datum eingeben.");
    return;
  }
  if (!props.formData.km || props.formData.km <= 0) {
    alert("Bitte einen gültigen Kilometerstand eingeben.");
    return;
  }

  console.log("Daten, die gesendet werden:", props.formData);
  emit('save', { ...props.formData });
};

</script>