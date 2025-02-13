import { ref, nextTick } from 'vue';
import { searchQuery, updateSearchQuery } from '~/composables/useSearchStore';

export const fahrzeuge = ref([]);
export const filteredFahrzeuge = ref([]);

export const applySearchFilter = () => {
  if (!searchQuery.value) {
    filteredFahrzeuge.value = fahrzeuge.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredFahrzeuge.value = fahrzeuge.value.filter(fahrzeug => {
      return (
        fahrzeug.kennzeichen?.toLowerCase().includes(query) ||
        fahrzeug.marke?.toLowerCase().includes(query) ||
        fahrzeug.modell?.toLowerCase().includes(query) ||
        fahrzeug.fahrgestell_nr?.toLowerCase().includes(query) ||
        fahrzeug.typschluessel_nr?.toLowerCase().includes(query) ||
        fahrzeug.karosserie_typ?.toLowerCase().includes(query) ||
        fahrzeug.kraftstoff_typ?.toLowerCase().includes(query) ||
        fahrzeug.versicherungs_nr?.toLowerCase().includes(query) ||
        String(fahrzeug.erstzulassung).toLowerCase().includes(query) ||
        String(fahrzeug.kaufdatum).toLowerCase().includes(query) ||
        String(fahrzeug.kaufpreis).toLowerCase().includes(query) ||
        String(fahrzeug.garantie).toLowerCase().includes(query) ||
        String(fahrzeug.bruttolistenpreis).toLowerCase().includes(query) ||
        String(fahrzeug.leistung_ps).toLowerCase().includes(query) ||
        String(fahrzeug.breite).toLowerCase().includes(query) ||
        String(fahrzeug.laenge).toLowerCase().includes(query) ||
        String(fahrzeug.hoehe).toLowerCase().includes(query) ||
        String(fahrzeug.leermasse).toLowerCase().includes(query) ||
        String(fahrzeug.gesamtmasse).toLowerCase().includes(query) ||
        String(fahrzeug.max_zuladung).toLowerCase().includes(query)
      );
    });
  }
};

export const resetFahrzeugList = () => {
  return new Promise((resolve) => { 
    searchQuery.value = ''; 
    filteredFahrzeuge.value = []; 

    nextTick(() => {
      updateSearchQuery(''); 
      applySearchFilter(); 
      resolve(); 
    });
  });
};