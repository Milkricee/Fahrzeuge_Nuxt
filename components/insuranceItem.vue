<template>
  <div
    class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 hover:bg-primary-100 hover:bg-opacity-85">
    <div class="flex justify-between items-center cursor-pointer" @click="toggleDetails">
      <div class="font-semibold text-primary-600 hover:text-primary-900">
        {{ insurance.name }} - Versicherungsnr.: {{ insurance.versicherungs_nr }}
      </div>
      <div class="flex space-x-2">
        <NuxtLink :to="{ path: '/versicherung/edit', query: { id: insurance.id } }"
          class="text-blue-500 hover:text-blue-700" title="Versicherung bearbeiten" @click.stop>
          ✏️
        </NuxtLink>
        <button @click.stop="confirmDelete" class="text-red-500 hover:text-red-700" title="Versicherung löschen">
          🗑️
        </button>
      </div>
    </div>

    <div v-if="showDetails" class="mt-4">
      <InsuranceTabs>
        <template #details>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2 text-primary-900">Versicherungsdetails</h3>
              <div class="text-primary-900">
                <p v-if="associatedVehicles.length > 0"><strong>Zugeordnete Fahrzeuge:</strong></p>
                <ul>
                  <li v-for="vehicle in associatedVehicles" :key="vehicle.fin">
                    <NuxtLink :to="{ path: '/kfz/fahrzeuge', query: { fin: vehicle.fin } }"
                      class="text-primary-500 font-bold hover:text-primary-700 hover:underline cursor-pointer">
                      {{ vehicle.marke }} {{ vehicle.modell }} ({{ vehicle.kennzeichen }})
                    </NuxtLink>
                  </li>
                </ul>

                <p v-if="insurance.versicherungstyp">Versicherungstyp: {{ insurance.versicherungstyp }}</p>
                <p v-if="insurance.deckungssumme">Deckungssumme: {{ formatCurrency(insurance.deckungssumme) }}</p>
                <p v-if="insurance.selbstbeteiligung">Selbstbeteiligung: {{ formatCurrency(insurance.selbstbeteiligung)
                  }}</p>
                <p v-if="insurance.betrag">Betrag: {{ formatCurrency(insurance.betrag) }}</p>
                <p v-if="insurance.beginn">Beginn: {{ formatDate(insurance.beginn) }}</p>
                <p v-if="insurance.ende">Ende: {{ formatDate(insurance.ende) }}</p>
                <p v-if="insurance.kundennummer">Kundennummer: {{ insurance.kundennummer }}</p>
              </div>
            </div>
          </div>
        </template>

        <template #zusatzleistungen>
          <ZusatzleistungenList :versicherungId="insurance.id" />
        </template>
      </InsuranceTabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import InsuranceTabs from './InsuranceTabs.vue';
import ZusatzleistungenList from './ZusatzleistungenList.vue';

const props = defineProps({
  insurance: Object,
});

const emit = defineEmits(['insuranceDeleted']);
const { $supabase } = useNuxtApp();
const showDetails = ref(false);
const associatedVehicles = ref([]);

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-';
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString('de-DE') : '-';
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
  if (showDetails.value && associatedVehicles.value.length === 0) {
    fetchAssociatedVehicles();
  }
};

async function fetchAssociatedVehicles() {
  try {
    const { data, error } = await $supabase
      .from('versicherung_fahrzeuge')
      .select('fahrzeug_fin')
      .eq('versicherung_id', props.insurance.id);

    if (error) {
      console.error('Fehler beim Abrufen der zugeordneten Fahrzeuge:', error.message);
    } else {
      const fins = data.map(item => item.fahrzeug_fin);
      if (fins.length > 0) {
        const { data: vehicles, error: vehicleError } = await $supabase
          .from('fahrzeuge')
          .select('fin, marke, modell, kennzeichen')
          .in('fin', fins);

        if (vehicleError) {
          console.error('Fehler beim Abrufen der Fahrzeugdetails:', vehicleError.message);
        } else {
          associatedVehicles.value = vehicles || [];
        }
      }
    }
  } catch (err) {
    console.error('Unerwarteter Fehler beim Abrufen der zugeordneten Fahrzeuge:', err.message);
  }
}

const confirmDelete = () => {
  if (confirm(`Möchten Sie die Versicherung ${props.insurance.name} wirklich löschen?`)) {
    deleteInsurance();
  }
};

const deleteInsurance = async () => {
  try {
    const { error } = await $supabase
      .from('versicherungen')
      .delete()
      .eq('id', props.insurance.id);

    if (error) {
      console.error('Fehler beim Löschen der Versicherung:', error.message);
      alert('Fehler beim Löschen der Versicherung: ' + error.message);
    } else {
      console.log('Versicherung erfolgreich gelöscht');
      emit('insuranceDeleted', props.insurance.id);
    }
  } catch (err) {
    console.error('Unerwarteter Fehler beim Löschen:', err.message);
    alert('Unerwarteter Fehler: ' + err.message);
  }
};
</script>