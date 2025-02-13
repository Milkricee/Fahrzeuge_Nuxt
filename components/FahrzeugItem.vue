<template>
  <div
    @click="toggleDetails"
    class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 hover:bg-primary-100 hover:bg-opacity-85 cursor-pointer"
  >
    <div class="flex justify-between items-center">
      <div class="font-semibold text-primary-600 hover:text-primary-900">
        {{ fahrzeug.kennzeichen }} - {{ fahrzeug.marke }} {{ fahrzeug.modell }}
      </div>
      <div class="flex space-x-2">
        <NuxtLink :to="{ path: '/kfz/fahrzeug-bearbeiten', query: { fin: fahrzeug.fin } }" class="text-blue-500 hover:text-blue-700" title="Fahrzeug bearbeiten">✏️</NuxtLink> 
        <NuxtLink :to="{ path: '/kfz/fahrzeug-historie', query: { fin: fahrzeug.fin } }" class="text-blue-500 hover:text-blue-700" title="Fahrzeughistorie">🔎</NuxtLink> 
        <button @click="deleteVehicle" class="text-red-500 hover:text-red-700" title="Fahrzeug löschen">🗑️</button> 
      </div>
    </div>

    <div v-if="showDetails" class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Allgemeine Daten</h3>
          <div class="text-primary-900">
            <p>Kennzeichen: {{ fahrzeug.kennzeichen }}</p>
            <p>Marke: {{ fahrzeug.marke }}</p>
            <p>Modell: {{ fahrzeug.modell }}</p>
            <p v-if="fahrzeug.sitze">Anzahl Sitze: {{ fahrzeug.sitze }}</p>
            <p v-if="fahrzeug.anhaengerkupplung !== null">Anhängerkupplung: {{ fahrzeug.anhaengerkupplung ? 'Ja' : 'Nein' }}</p>
            <p v-if="fahrzeug.schaden !== null">Schaden: {{ fahrzeug.schaden ? 'Ja' : 'Nein' }}</p>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Kennzahlen</h3>
          <div class="text-primary-900">
            <p>FIN: {{ fahrzeug.fin }}</p> 
            <p v-if="fahrzeug.typschluessel_nr">Typschlüsselnummer: {{ fahrzeug.typschluessel_nr }}</p>
            <p v-if="fahrzeug.versicherungs_nr">Versicherungsnummer: {{ fahrzeug.versicherungs_nr }}</p>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Erwerb</h3>
          <div class="text-primary-900">
            <p v-if="fahrzeug.erstzulassung">Erstzulassung: {{ fahrzeug.erstzulassung }}</p>
            <p v-if="fahrzeug.kaufdatum">Kaufdatum: {{ fahrzeug.kaufdatum }}</p>
            <p v-if="fahrzeug.kaufpreis">Kaufpreis: {{ fahrzeug.kaufpreis }} €</p> 
            <p v-if="fahrzeug.garantie">Garantie: {{ fahrzeug.garantie }}</p>
            <p v-if="fahrzeug.bruttolistenpreis">Bruttolistenpreis: {{ fahrzeug.bruttolistenpreis }} €</p> 
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-primary-900">Technische Daten</h3>
          <div class="text-primary-900">
            <p v-if="fahrzeug.karosserie_typ">Karosserietyp: {{ fahrzeug.karosserie_typ }}</p>
            <p v-if="fahrzeug.leistung_ps">Leistung: {{ fahrzeug.leistung_ps }} PS</p>
            <div v-if="fahrzeug.breite || fahrzeug.laenge || fahrzeug.hoehe">
              <p class="font-semibold">Abmessungen:</p> 
              <p>
                <span v-if="fahrzeug.laenge">Länge: {{ fahrzeug.laenge }} cm </span> 
                <span v-if="fahrzeug.breite">Breite: {{ fahrzeug.breite }} cm </span> 
                <span v-if="fahrzeug.hoehe">Höhe: {{ fahrzeug.hoehe }} cm</span>
              </p>
            </div>
            <div v-if="fahrzeug.leermasse || fahrzeug.gesamtmasse || fahrzeug.max_zuladung">
              <p class="font-semibold">Gewicht:</p>
              <p>
                <span v-if="fahrzeug.leermasse">Leermasse: {{ fahrzeug.leermasse }} kg</span><br>
                <span v-if="fahrzeug.gesamtmasse">Gesamtmasse: {{ fahrzeug.gesamtmasse }} kg</span><br>
                <span v-if="fahrzeug.max_zuladung">Max. Zuladung: {{ fahrzeug.max_zuladung }} kg</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app'; // Importiere useNuxtApp, um $supabase zu verwenden

const props = defineProps({
  fahrzeug: Object,
  showDetails: Boolean
});

const emit = defineEmits(['fahrzeug-deleted']); // Deklariere das 'fahrzeug-deleted'-Event
const { $supabase } = useNuxtApp(); // Supabase-Client abrufen
const showDetails = ref(props.showDetails);

function toggleDetails() {
  showDetails.value = !showDetails.value; // Zeige oder verstecke Details
}

async function deleteVehicle() {
  const confirmed = window.confirm('Möchten Sie das Fahrzeug wirklich löschen?');
  if (confirmed) {
    try {
      const { error } = await $supabase.rpc('delete_fahrzeug', { fin_input: props.fahrzeug.fin });

      if (error) {
        alert('Ein Fehler ist aufgetreten: ' + error.message);
      } else {
        alert('Fahrzeug und alle abhängigen Einträge wurden erfolgreich gelöscht!');
        emit('fahrzeug-deleted', props.fahrzeug.fin);
        location.reload();
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error.message);
      alert('Ein unerwarteter Fehler ist aufgetreten.');
    }
  }
}

</script>
