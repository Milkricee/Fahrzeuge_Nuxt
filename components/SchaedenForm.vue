<template>
  <div>
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label for="beschreibung" class="block text-sm font-medium text-gray-700">Beschreibung</label>
        <textarea id="beschreibung" v-model="formData.beschreibung" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required></textarea>
      </div>
      <div>
        <label for="schadensart" class="block text-sm font-medium text-gray-700">Schadensart</label>
        <input type="text" id="schadensart" v-model="formData.schadensart" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required>
      </div>
      <div>
        <label for="fahrer" class="block text-sm font-medium text-gray-700">Fahrer</label>
        <input type="text" id="fahrer" v-model="formData.fahrer" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required>
      </div>
      <div>
        <label for="eigenverschulden" class="block text-sm font-medium text-gray-700">Eigenverschulden</label>
        <input type="checkbox" id="eigenverschulden" v-model="formData.eigenverschulden" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md">
      </div>
      <div>
        <label for="gemeldet" class="block text-sm font-medium text-gray-700">Gemeldet</label>
        <input type="checkbox" id="gemeldet" v-model="formData.gemeldet" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md">
      </div>
      <div>
        <label for="hoehe_des_schadens" class="block text-sm font-medium text-gray-700">Höhe des Schadens</label>
        <input type="number" id="hoehe_des_schadens" v-model="formData.hoehe_des_schadens" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  formData: Object,
  activeTab: String
});

const emit = defineEmits(['update:formData']);

//  formData als ref definieren, um die Reaktivität zu gewährleisten
const formData = ref(props.formData); 

//  watch Effekt hinzufügen, um formData zu aktualisieren, wenn sich props.formData ändert
watch(() => props.formData, (newFormData) => {
  formData.value = newFormData;
});

//  watch Effekt hinzufügen, um Änderungen an formData an die Elternkomponente zu emittieren
watch(formData, (newFormData) => {
  emit('update:formData', newFormData);
});
</script>