<template>
  <div class="mb-4 mt-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 max-w-xl w-full shadow-md flex flex-col mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-primary-600">Versicherung bearbeiten</h2>

    <form @submit.prevent="updateInsurance" class="space-y-6">
      <div class="grid grid-cols-1 gap-4"> 
        <div>
          <label for="insuranceName" class="block text-sm font-medium text-primary-900">Name der Versicherung</label>
          <input
            v-model="insurance.name"
            id="insuranceName"
            type="text"
            class="p-2 border rounded w-full"
            placeholder="Name der Versicherung"
            required
          />
        </div>

        <div>
          <label for="insuranceNumber" class="block text-sm font-medium text-primary-900">Versicherungsnummer</label>
          <input
            v-model="insurance.versicherungs_nr"
            id="insuranceNumber"
            type="text"
            class="p-2 border rounded w-full"
            placeholder="Versicherungsnummer"
            required
          />
        </div>

        <div>
          <label for="betrag" class="block text-sm font-medium text-primary-900">Betrag</label>
          <input
            v-model="insurance.betrag"
            id="betrag"
            type="number"
            class="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label for="beginn" class="block text-sm font-medium text-primary-900">Beginn</label>
          <input
            v-model="insurance.beginn"
            id="beginn"
            type="date"
            class="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label for="ende" class="block text-sm font-medium text-primary-900">Ende</label>
          <input
            v-model="insurance.ende"
            id="ende"
            type="date"
            class="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label for="searchFins" class="block text-sm font-medium text-primary-900">Fahrzeuge auswählen</label>
          <input
            v-model="searchTerm"
            id="searchFins"
            type="text"
            class="p-2 border rounded w-full"
            placeholder="FIN oder Modell suchen"
          />
          <ul v-if="filteredVehicles.length" class="dropdown max-h-40 overflow-y-auto">
            <li
              v-for="vehicle in filteredVehicles"
              :key="vehicle.fin"
              @click="addVehicle(vehicle)"
              class="cursor-pointer hover:bg-gray-100 p-2"
            >
              {{ vehicle.modell }} (FIN: {{ vehicle.fin }})
            </li>
          </ul>
          <ul class="selected-fins mt-2">
            <li v-for="fin in selectedFins" :key="fin" class="selected-fin flex justify-between items-center mb-2">
              {{ getVehicleInfo(fin) }}
              <button @click="removeVehicle(fin)" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Entfernen
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex justify-end mt-4"> 
        <button type="submit" class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          Versicherung aktualisieren
        </button>
      </div>
    </form>

    <NuxtLink to="/versicherung" class="mt-3 text-primary-500 hover:underline mx-auto">Zurück zur Übersicht</NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useNuxtApp } from '#app';

const { $supabase } = useNuxtApp();
const route = useRoute();
const insuranceId = route.query.id;

const insurance = ref({});
const vehicles = ref([]);
const selectedFins = ref([]);
const searchTerm = ref('');

async function fetchVehicles() {
  try {
    const { data, error } = await $supabase.from('fahrzeuge').select('fin, modell');
    if (error) throw error;
    vehicles.value = data || [];
  } catch (err) {
    console.error('Fehler beim Abrufen der Fahrzeuge:', err.message);
  }
}

async function fetchInsurance() {
  try {
    const { data, error } = await $supabase
      .from('versicherungen')
      .select('*, versicherung_fahrzeuge (fahrzeug_fin)')
      .eq('id', insuranceId)
      .single();
    if (error) throw error;

    insurance.value = {
      ...data,
      fahrzeug_fins: undefined,
    };
    selectedFins.value = data.versicherung_fahrzeuge.map((item) => item.fahrzeug_fin);
  } catch (err) {
    console.error('Fehler beim Abrufen der Versicherung:', err.message);
  }
}

async function updateInsurance() {
  try {
    // Nur die relevanten Felder der Versicherung extrahieren
    const updatedInsurance = {
      name: insurance.value.name,
      versicherungs_nr: insurance.value.versicherungs_nr,
      betrag: insurance.value.betrag,
      beginn: insurance.value.beginn,
      ende: insurance.value.ende,
    };

    // Versicherung aktualisieren
    const { error } = await $supabase
      .from('versicherungen')
      .update(updatedInsurance)
      .eq('id', insuranceId);

    if (error) throw error;

    // Bestehende Zuordnungen löschen
    const { error: deleteError } = await $supabase
      .from('versicherung_fahrzeuge')
      .delete()
      .eq('versicherung_id', insuranceId);

    if (deleteError) throw deleteError;

    // Neue Zuordnungen hinzufügen
    const associations = selectedFins.value.map((fin) => ({
      versicherung_id: insuranceId,
      fahrzeug_fin: fin,
    }));

    const { error: assocError } = await $supabase.from('versicherung_fahrzeuge').insert(associations);
    if (assocError) throw assocError;

    alert('Versicherung erfolgreich aktualisiert!');
    location.href = '/versicherung';
  } catch (err) {
    console.error('Fehler beim Aktualisieren der Versicherung:', err.message);
    alert('Fehler: Versicherung konnte nicht aktualisiert werden.');
  }
}


const filteredVehicles = computed(() =>
  vehicles.value.filter(
    (vehicle) =>
      vehicle.fin.includes(searchTerm.value) || vehicle.modell.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

function addVehicle(vehicle) {
  if (!selectedFins.value.includes(vehicle.fin)) {
    selectedFins.value.push(vehicle.fin);
  }
  searchTerm.value = '';
}

function removeVehicle(fin) {
  selectedFins.value = selectedFins.value.filter((selectedFin) => selectedFin !== fin);
}

function getVehicleInfo(fin) {
  const vehicle = vehicles.value.find((v) => v.fin === fin);
  return vehicle ? `${vehicle.modell} (FIN: ${vehicle.fin})` : fin;
}

onMounted(() => {
  fetchInsurance();
  fetchVehicles();
});
</script>

<style scoped>

.dropdown {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  background-color: white;
  max-height: 150px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

/* Selected FINs */
.selected-fins {
  list-style: none;
  margin-top: 1rem;
  padding: 0;
}

.selected-fin {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.selected-fin button {
  color: white;
  border: none;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}
.form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  
  .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
</style>
