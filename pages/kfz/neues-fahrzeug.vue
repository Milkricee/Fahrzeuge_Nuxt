<template>
  <div class="p-4">
    <div class="bg-primary-50 bg-opacity-85 border border-primary-200 rounded-lg p-6 shadow-md"> 
      <FahrzeugForm :initialData="newFahrzeug" @submit="addFahrzeug" @cancel="cancelAdd" /> 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import FahrzeugForm from '~/components/FahrzeugForm.vue';
import { useNuxtApp, useRouter } from '#app';

const newFahrzeug = ref({
  fin: '',
  marke: '',
  modell: '',
  kennzeichen: '',
  kilometerstand: null,
  erstzulassung: null,
  kaufpreis: null,
  garantie: null,
  versicherungs_nr: null,
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
const router = useRouter();

// Variable für ungespeicherte Änderungen
const hasUnsavedChanges = ref(false);

// onMounted: Event Listener für Änderungen am Formular hinzufügen
onMounted(() => {
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
});

// onBeforeUnmount: Event Listener für beforeunload entfernen
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Funktion für beforeunload Event
const handleBeforeUnload = (event) => {
  if (hasUnsavedChanges.value) {
    event.preventDefault();
    event.returnValue = ''; //  Chrome benötigt einen nicht-leeren Rückgabewert
  }
};

async function addFahrzeug(fahrzeugData) {
  console.log("Daten die gesendet werden:", fahrzeugData);
  if (!fahrzeugData.fin) {
    console.error("FIN ist erforderlich, um ein Fahrzeug hinzuzufügen.");
    return;
  }
  const { data, error } = await $supabase.from('fahrzeuge').insert([fahrzeugData]);
  console.log("Supabase Response:", { data, error });

  if (error) {
    console.error("Fehler beim Hinzufügen des Fahrzeugs:", error.message, error.details);
  } else {
    console.log("Fahrzeug erfolgreich hinzugefügt:", data);
    hasUnsavedChanges.value = false; 
    router.push('/kfz/fahrzeuge');
  }
}

function cancelAdd() {
  //  Beim Abbrechen hasUnsavedChanges auf false setzen
  hasUnsavedChanges.value = false; 
  router.push('/kfz/fahrzeuge');
}
</script>