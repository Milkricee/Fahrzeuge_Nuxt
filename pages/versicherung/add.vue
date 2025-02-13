<template>
  <div
    class="mb-4 mt-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 max-w-5xl w-full shadow-md flex flex-col mx-auto"
  >
    <h2 class="text-2xl font-bold text-center mb-4">Versicherung hinzufügen</h2>

    <div v-if="loading" class="text-center text-primary-500">Lade Fahrzeuge...</div>

    <form v-else @submit.prevent="addInsurance" class="insurance-form">
      <!-- Formular Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Name der Versicherung -->
        <div>
          <label for="insuranceName" class="form-label">Name der Versicherung</label>
          <input
            v-model="insurance.name"
            id="insuranceName"
            type="text"
            class="form-input"
            placeholder="Name der Versicherung"
            required
          />
        </div>

        <!-- Versicherungsnummer -->
        <div>
          <label for="insuranceNumber" class="form-label">Versicherungsnummer</label>
          <input
            v-model="insurance.versicherungs_nr"
            id="insuranceNumber"
            type="text"
            class="form-input"
            placeholder="Versicherungsnummer"
            required
          />
        </div>

        <!-- Kundennummer -->
        <div>
          <label for="kundennummer" class="form-label">Kundennummer</label>
          <input
            v-model="insurance.kundennummer"
            id="kundennummer"
            type="text"
            class="form-input"
            placeholder="Kundennummer"
            required
          />
        </div>

        <!-- Versicherungstyp -->
        <div>
          <label for="versicherungstyp" class="form-label">Versicherungstyp</label>
          <select
            v-model="insurance.versicherungstyp"
            id="versicherungstyp"
            class="form-input"
            required
          >
            <option value="" disabled>Versicherungstyp auswählen</option>
            <option value="Haftpflicht">Haftpflicht</option>
            <option value="Teilkasko">Teilkasko</option>
            <option value="Vollkasko">Vollkasko</option>
          </select>
        </div>

        <!-- Deckungssumme -->
        <div>
          <label for="deckungssumme" class="form-label">Deckungssumme (€)</label>
          <input
            v-model.number="insurance.deckungssumme"
            id="deckungssumme"
            type="number"
            step="0.01"
            class="form-input"
            placeholder="Deckungssumme"
            required
          />
        </div>

        <!-- Selbstbeteiligung -->
        <div>
          <label for="selbstbeteiligung" class="form-label">Selbstbeteiligung (€)</label>
          <input
            v-model.number="insurance.selbstbeteiligung"
            id="selbstbeteiligung"
            type="number"
            step="0.01"
            class="form-input"
            placeholder="Selbstbeteiligung"
            required
          />
        </div>

        <!-- Betrag -->
        <div>
          <label for="betrag" class="form-label">Betrag (€)</label>
          <input
            v-model.number="insurance.betrag"
            id="betrag"
            type="number"
            step="0.01"
            class="form-input"
            placeholder="Betrag"
            required
          />
        </div>

        <!-- Beginn -->
        <div>
          <label for="beginn" class="form-label">Beginn</label>
          <input
            v-model="insurance.beginn"
            id="beginn"
            type="date"
            class="form-input"
            required
          />
        </div>

        <!-- Ende -->
        <div>
          <label for="ende" class="form-label">Ende</label>
          <input
            v-model="insurance.ende"
            id="ende"
            type="date"
            class="form-input"
            required
          />
        </div>
      </div>

      <!-- Fahrzeuge auswählen -->
      <div class="mt-6">
        <label for="fahrzeugFins" class="form-label">Fahrzeuge auswählen</label>
        <multiselect
          v-model="selectedFins"
          :options="vehicles"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Fahrzeug suchen und auswählen"
          label="displayName"
          track-by="fin"
          class="form-multiselect"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-6">
        <button
          type="submit"
          class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
        >
          Versicherung hinzufügen
        </button>
      </div>
    </form>

    <!-- Zurück Button -->
    <NuxtLink to="/versicherung" class="mt-3 text-primary-500 hover:underline mx-auto block text-center">
      Zurück zur Übersicht
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const { $supabase } = useNuxtApp();

const loading = ref(true); // Ladezustand für Fahrzeuge
const insurance = ref({
  name: '',
  versicherungs_nr: '',
  kundennummer: '',
  versicherungstyp: '',
  deckungssumme: null,
  selbstbeteiligung: null,
  betrag: null,
  beginn: '',
  ende: '',
});

const vehicles = ref([]); // Liste der Fahrzeuge
const selectedFins = ref([]); // Ausgewählte Fahrzeuge für die Zuordnung

// Fahrzeuge aus der Datenbank abrufen
async function fetchVehicles() {
  try {
    const { data, error } = await $supabase
      .from('fahrzeuge')
      .select('fin, modell, marke');
    if (error) throw error;

    vehicles.value = data.map((vehicle) => ({
      ...vehicle,
      displayName: `${vehicle.marke} ${vehicle.modell} (FIN: ${vehicle.fin})`,
    }));
  } catch (err) {
    console.error('Fehler beim Abrufen der Fahrzeuge:', err.message);
    alert('Fehler beim Abrufen der Fahrzeugdaten.');
  } finally {
    loading.value = false; // Ladezustand beenden
  }
}

// Versicherung hinzufügen
async function addInsurance() {
  try {
    const { data, error } = await $supabase
      .from('versicherungen')
      .insert({ ...insurance.value })
      .select('id')
      .single();
    if (error) throw error;

    const insuranceId = data.id;

    // Fahrzeuge der Versicherung zuordnen
    const associations = selectedFins.value.map((vehicle) => ({
      versicherung_id: insuranceId,
      fahrzeug_fin: vehicle.fin,
    }));

    const { error: assocError } = await $supabase
      .from('versicherung_fahrzeuge')
      .insert(associations);
    if (assocError) throw assocError;

    alert('Versicherung erfolgreich hinzugefügt!');
    location.href = '/versicherung';
  } catch (err) {
    console.error('Fehler beim Hinzufügen der Versicherung:', err.message);
    alert('Fehler: Versicherung konnte nicht hinzugefügt werden.');
  }
}

onMounted(fetchVehicles);
</script>
<style scoped>
.form-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.insurance-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus,
.form-select:focus {
  border-color: #007bff;
  outline: none;
}

.form-multiselect {
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.5rem;
}

.form-multiselect .multiselect__input {
  height: auto;
}
</style>
