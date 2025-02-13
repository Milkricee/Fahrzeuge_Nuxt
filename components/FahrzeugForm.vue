<template>
  <form @submit.prevent="onSubmit" id="entryForm" class="container mx-auto p-4"> 
    <div class="bg-primary-50 bg-opacity-85 border border-primary-200 rounded-lg p-6 shadow-md">  
      <h2 class="text-2xl font-semibold mb-4 text-primary-600"> 
        {{ isEditing ? 'Fahrzeug bearbeiten' : 'Fahrzeug hinzufügen' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Allgemeine Daten</h3>
          <div class="grid grid-cols-1 gap-4"> 
            <div>
              <label class="block text-sm font-medium text-primary-900" for="kennzeichen">Kennzeichen</label>
              <input id="kennzeichen" v-model="fahrzeug.kennzeichen" type="text" class="p-2 border rounded w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="marke">Marke</label>
              <input id="marke" v-model="fahrzeug.marke" type="text" class="p-2 border rounded w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="modell">Modell</label>
              <input id="modell" v-model="fahrzeug.modell" type="text" class="p-2 border rounded w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="sitze">Anzahl Sitze</label>
              <input id="sitze" v-model="fahrzeug.sitze" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="anhaengerkupplung">Anhängerkupplung</label>
              <input id="anhaengerkupplung" v-model="fahrzeug.anhaengerkupplung" type="checkbox" class="p-2 rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="schaden">Schaden</label>
              <input id="schaden" v-model="fahrzeug.schaden" type="checkbox" class="p-2 rounded w-full" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Kennzahlen</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary-900" for="fin">FIN</label>
              <input id="fin" v-model="fahrzeug.fin" type="text" class="p-2 border rounded w-full" :disabled="isEditing" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="typschluessel_nr">Typschlüsselnummer</label>
              <input id="typschluessel_nr" v-model="fahrzeug.typschluessel_nr" type="text" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="versicherungs_nr">Versicherungsnummer</label>
              <input id="versicherungs_nr" v-model="fahrzeug.versicherungs_nr" type="text" class="p-2 border rounded w-full" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Erwerb</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary-900" for="erstzulassung">Erstzulassung</label>
              <input id="erstzulassung" v-model="fahrzeug.erstzulassung" type="date" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="kaufdatum">Kaufdatum</label>
              <input id="kaufdatum" v-model="fahrzeug.kaufdatum" type="date" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="kaufpreis">Kaufpreis</label>
              <input id="kaufpreis" v-model="fahrzeug.kaufpreis" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="bruttolistenpreis">Bruttolistenpreis</label>
              <input id="bruttolistenpreis" v-model="fahrzeug.bruttolistenpreis" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="garantie">Garantie</label>
              <input id="garantie" v-model="fahrzeug.garantie" type="date" class="p-2 border rounded w-full" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Technische Daten</h3>
          <div class="grid grid-cols-1 gap-4"> 
            <div>
              <label class="block text-sm font-medium text-primary-900" for="karosserie_typ">Karosserietyp</label>
              <input id="karosserie_typ" v-model="fahrzeug.karosserie_typ" type="text" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="kraftstoff_typ">Kraftstofftyp</label>
              <input id="kraftstoff_typ" v-model="fahrzeug.kraftstoff_typ" type="text" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="leistung_ps">Leistung (PS)</label>
              <input id="leistung_ps" v-model="fahrzeug.leistung_ps" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="breite">Breite (cm)</label>
              <input id="breite" v-model="fahrzeug.breite" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="laenge">Länge (cm)</label>
              <input id="laenge" v-model="fahrzeug.laenge" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="hoehe">Höhe (cm)</label>
              <input id="hoehe" v-model="fahrzeug.hoehe" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="leermasse">Leermasse (kg)</label>
              <input id="leermasse" v-model="fahrzeug.leermasse" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="gesamtmasse">Gesamtmasse (kg)</label>
              <input id="gesamtmasse" v-model="fahrzeug.gesamtmasse" type="number" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-900" for="max_zuladung">Max. Zuladung (kg)</label>
              <input id="max_zuladung" v-model="fahrzeug.max_zuladung" type="number" class="p-2 border rounded w-full" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4"> 
        <button type="button" @click="$emit('cancel')"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
          Abbrechen
        </button>
        <button type="submit" class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          {{ isEditing ? 'Änderungen speichern' : 'Speichern' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  initialData: Object,
  isEditing: Boolean
});

const emit = defineEmits(['submit', 'cancel']);

const fahrzeug = ref({
  fin: props.initialData.fin || '',
  ...props.initialData
});

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

function onSubmit() {
  emit('submit', fahrzeug.value);
  //  Nach dem Speichern hasUnsavedChanges auf false setzen
  hasUnsavedChanges.value = false; 
}

watch(fahrzeug, (newValue) => {
  console.log("Aktuelle Fahrzeugdaten:", newValue);
}, { deep: true });


watch(() => props.initialData, (newData) => {
  fahrzeug.value = { fin: newData.fin || '', ...newData };
  //  Beim Laden von initialData hasUnsavedChanges auf false setzen
  hasUnsavedChanges.value = false; 
});
</script>