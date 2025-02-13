<script setup>
import { ref, nextTick } from 'vue';
import { useNuxtApp } from '#app';
import { searchQuery as globalSearchQuery, updateSearchQuery } from '~/composables/useSearchStore';
import { applySearchFilter } from '~/composables/fahrzeugHelper';
import debounce from 'lodash/debounce';

const searchQuery = globalSearchQuery;
const suggestions = ref([]);
const { $supabase } = useNuxtApp();

const fetchSuggestions = debounce(async () => {
  if (searchQuery.value?.length > 0) {
    const { data, error } = await $supabase
      .from('fahrzeuge')
      .select('kennzeichen, marke, modell, fahrgestell_nr, typschluessel_nr, karosserie_typ, kraftstoff_typ, versicherungs_nr')
      .or(`kennzeichen.ilike.%${searchQuery.value}%,marke.ilike.%${searchQuery.value}%,modell.ilike.%${searchQuery.value}%,fahrgestell_nr.ilike.%${searchQuery.value}%,typschluessel_nr.ilike.%${searchQuery.value}%,karosserie_typ.ilike.%${searchQuery.value}%,kraftstoff_typ.ilike.%${searchQuery.value}%,versicherungs_nr.ilike.%${searchQuery.value}%`)
      .limit(20);

    if (error) {
      suggestions.value = [];
      console.error('Fehler beim Abrufen der Vorschläge:', error);
    } else {
      suggestions.value = formatSuggestions(data);
    }
  } else {
    suggestions.value = [];
  }
}, 300);

function formatSuggestions(data) {
  return data.map(item => {
    if (item.kennzeichen?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Kennzeichen', value: item.kennzeichen };
    } else if (item.marke?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Marke', value: item.marke };
    } else if (item.modell?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Modell', value: item.modell };
    } else if (item.fahrgestell_nr?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Fahrgestellnummer', value: item.fahrgestell_nr };
    } else if (item.typschluessel_nr?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Typschlüsselnummer', value: item.typschluessel_nr };
    } else if (item.karosserie_typ?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Karosserietyp', value: item.karosserie_typ };
    } else if (item.kraftstoff_typ?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Kraftstofftyp', value: item.kraftstoff_typ };
    } else if (item.versicherungs_nr?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return { type: 'Versicherungsnummer', value: item.versicherungs_nr };
    }
  });
}

function selectSuggestion(item) {
  updateSearchQuery(item.value); 
  suggestions.value = []; 
}

function resetSearch() {
  searchQuery.value = '';
  suggestions.value = []; // Vorschläge zurücksetzen
  nextTick(() => {
    updateSearchQuery(''); 
    applySearchFilter();
    $emit('reset'); 
  });
}

// Funktion zum Ausblenden der Vorschläge
function hideSuggestions() {
  suggestions.value = [];
}
</script>

<template>
  <div class="relative flex items-center space-x-2">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Suche nach..."
      class="p-2 rounded-md text-black border"
      @keydown.enter="$emit('search')"
      @input="fetchSuggestions"
    />
    <button @click="$emit('search'); hideSuggestions()" class="bg-primary-500 text-white px-4 py-2 rounded-md"> 
      Suchen
    </button>
    <button @click="resetSearch" class="bg-gray-500 text-white px-4 py-2 rounded-md"> 
      Zurücksetzen
    </button>

    <ul v-if="suggestions.length > 0"
      class="absolute bg-white text-black p-2 rounded-md shadow-md top-full mt-1 w-full max-h-48 overflow-y-auto z-20">
      <li v-for="item in suggestions" :key="item.value" @click="selectSuggestion(item)"
        class="cursor-pointer hover:bg-primary-100 p-2">
        <strong>{{ item.type }}:</strong> {{ item.value }}
      </li>
    </ul>
  </div>
</template>