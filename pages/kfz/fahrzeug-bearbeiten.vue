<template>
  <div class="p-4">
    <div class="bg-primary-50 bg-opacity-85 border border-primary-200 rounded-lg p-6 shadow-md">  
      <FahrzeugForm :initialData="fahrzeug" :isEditing="true" @submit="updateFahrzeug" @cancel="cancelEdit" /> 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import FahrzeugForm from '~/components/FahrzeugForm.vue';
import { useNuxtApp, useRouter, useRoute } from '#app';

const fahrzeug = ref({
  marke: '',
  modell: '',
  kennzeichen: '',
  kilometerstand: null,
  erstzulassung: null,
  kaufpreis: null,
  garantie: null,
  versicherungs_nr: null,
  fahrgestell_nr: '',
  typschluessel_nr: '',
  karosserie_typ: '',
  kraftstoff_typ: '',
  leistung_ps: null,
  bruttolistenpreis: null,
  kaufdatum: null,
  breite: null,
  laenge: null,
  hoehe: null,
  leermasse: null,
  gesamtmasse: null,
  max_zuladung: null,
  anhaengerkupplung: false,
  sitze: null,
  schaden: false
});

const { $supabase } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const fin = route.query.fin; 

// Variable für ungespeicherte Änderungen
const hasUnsavedChanges = ref(false);

// onMounted: Event Listener für Änderungen am Formular hinzufügen
onMounted(async () => {
  // Wähle alle Input- und Textarea-Elemente im Formular aus
  const formElements = document.querySelectorAll('#entryForm input, #entryForm textarea');

  // Füge jedem Element einen Event Listener hinzu, der hasUnsavedChanges auf true setzt, 
  // wenn sich der Wert des Elements ändert
  formElements.forEach(element => {
    element.addEventListener('input', () => {
      hasUnsavedChanges.value = true;
    });
  });

  // Event Listener für beforeunload hinzufügen
  window.addEventListener('beforeunload', handleBeforeUnload);

  const { data, error } = await $supabase.from('fahrzeuge').select('*').eq('fin', fin).single(); 
  if (error) {
    console.error("Fehler beim Abrufen des Fahrzeugs:", error);
    router.push('/kfz/fahrzeuge'); 
  } else {
    fahrzeug.value = data;
  }
});

// onBeforeUnmount: Event Listener für beforeunload entfernen
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Funktion für beforeunload Event
const handleBeforeUnload = (event) => {
  if (hasUnsavedChanges.value) {
    event.preventDefault();
    //  Chrome benötigt einen nicht-leeren Rückgabewert
    event.returnValue = ''; 
  }
};

async function updateFahrzeug(fahrzeugData) {
  const { data, error } = await $supabase.from('fahrzeuge').update(fahrzeugData).eq('fin', fahrzeugData.fin); 
  if (error) {
    console.error("Fehler beim Aktualisieren des Fahrzeugs:", error);
  } else {
    console.log("Fahrzeug erfolgreich aktualisiert:", data);
    //  Nach dem Speichern hasUnsavedChanges auf false setzen
    hasUnsavedChanges.value = false; 
    router.push('/kfz/fahrzeuge');
  }
}

function cancelEdit() {
  //  Beim Abbrechen hasUnsavedChanges auf false setzen
  hasUnsavedChanges.value = false; 
  router.push('/kfz/fahrzeuge');
}
</script>