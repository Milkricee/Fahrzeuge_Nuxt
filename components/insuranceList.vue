<template>
  <div>
      <ul>
        <!-- Anzeige der InsuranceItem-Komponente -->
        <InsuranceItem
          v-for="insurance in insurances"
          :key="insurance.id"
          :insurance="insurance"
          @insuranceDeleted="removeInsurance"
        />
      </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import InsuranceItem from '~/components/insuranceItem.vue'; // Import der InsuranceItem-Komponente
import { supabase } from '~/plugins/supabase'; // Supabase Verbindung

const insurances = ref([]);
const loading = ref(true);
const error = ref(null);

async function fetchInsurances() {
  try {
    const { data, error: fetchError } = await supabase
      .from('versicherungen')
      .select('*')
      .order('beginn', { ascending: true });

    if (fetchError) throw fetchError;

    insurances.value = data || [];
  } catch (err) {
    error.value = `Fehler beim Abrufen der Versicherungen: ${err.message}`;
  } finally {
    loading.value = false;
  }
}

// Entfernt eine gelöschte Versicherung aus der Liste
function removeInsurance(deletedInsuranceId) {
  insurances.value = insurances.value.filter(
    (insurance) => insurance.id !== deletedInsuranceId
  );
}

onMounted(() => {
  fetchInsurances();
});
</script>