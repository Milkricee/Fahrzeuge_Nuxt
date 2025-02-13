<template>
  <div class="p-4">
    <div class="bg-primary-50 bg-opacity-85 border border-primary-200 rounded-lg p-6 shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-semibold text-primary-600">Fahrzeugliste</h1>
        <NuxtLink to="/kfz/neues-fahrzeug"
          class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          Fahrzeug hinzufügen
        </NuxtLink>
      </div>
      <div class="mb-4">
        <SearchInput @search="handleSearchClick" @reset="resetFahrzeugList" />
      </div>
      <div>
        <FahrzeugItem v-for="fahrzeug in filteredFahrzeuge" :key="fahrzeug.fin" :fahrzeug="fahrzeug"
          :show-details="shouldShowDetails(fahrzeug.fin)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNuxtApp, useRoute } from '#app';
import { 
  fahrzeuge, 
  filteredFahrzeuge, 
  applySearchFilter, 
  resetFahrzeugList 
} from '~/composables/fahrzeugHelper';
import FahrzeugItem from '~/components/FahrzeugItem.vue';
import SearchInput from '~/components/SearchInput.vue';

const { $supabase } = useNuxtApp();
const route = useRoute();
const queryFin = route.query.fin;

async function fetchFahrzeuge() {
  const { data, error } = await $supabase.from('fahrzeuge').select('*');
  if (!error) {
    fahrzeuge.value = data;
    filteredFahrzeuge.value = data;
  } else {
    console.error('Fehler beim Abrufen der Fahrzeuge:', error.message);
  }
}

onMounted(fetchFahrzeuge);

const handleSearchClick = () => {
  applySearchFilter();
};

const shouldShowDetails = (fin) => {
  return fin === queryFin;
};
</script>