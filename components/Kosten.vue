<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium">Kostenübersicht</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85">
        <h4 class="text-sm font-medium text-gray-500">
          Gesamtkosten (Jahr)
        </h4>
        <p class="text-2xl font-bold">{{ formatCurrency(yearlyTotal) }}</p>
      </div>
      <div class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85">
        <h4 class="text-sm font-medium text-gray-500">
          Durchschnitt / Monat
        </h4>
        <p class="text-2xl font-bold">
          {{ formatCurrency(monthlyAverage) }}
        </p>
      </div>
      <div class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85">
        <h4 class="text-sm font-medium text-gray-500">Höchste Ausgabe</h4>
        <p class="text-2xl font-bold">{{ formatCurrency(highestCost) }}</p>
      </div>
    </div>

    <div class="overflow-x-auto p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th 
              @click="$emit('sort', 'datum', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Datum
              <span v-if="sortKey === 'datum'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'kategorie', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Kategorie
              <span v-if="sortKey === 'kategorie'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'beschreibung', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Beschreibung
              <span v-if="sortKey === 'beschreibung'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'betrag', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Betrag
              <span v-if="sortKey === 'betrag'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'beleg_nr', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Beleg-Nr.
              <span v-if="sortKey === 'beleg_nr'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="kosten in sortedKosten" :key="kosten.id"> 
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(kosten.datum) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ kosten.kategorie }}
            </td>
            <td class="px-6 py-4">{{ kosten.beschreibung }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">
              {{ formatCurrency(kosten.betrag) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
              {{ kosten.beleg_nr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editEntry(kosten)" class="text-blue-600 hover:text-blue-900 mr-2">
                ✏️
              </button>
              <button @click="deleteEntry(kosten.id)" class="text-red-600 hover:text-red-900">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNuxtApp, useRoute } from "#app";

const { $supabase } = useNuxtApp();
const route = useRoute();

const emit = defineEmits(['update', 'edit', 'sort']);

const kostenListe = ref([]);
const props = defineProps({
  sortKey: String,
  sortDir: String,
});

// sortedKosten computed property hinzufügen
const sortedKosten = computed(() => {
  if (!props.sortKey) {
    return kostenListe.value;
  }
  return [...kostenListe.value].sort((a, b) => {
    let aVal = a[props.sortKey];
    let bVal = b[props.sortKey];
    //  Wenn die zu sortierende Spalte "betrag" ist, 
    //  verwende numerische Sortierung, sonst String-Sortierung
    if (props.sortKey === 'betrag') {
      return (aVal - bVal) * (props.sortDir === 'asc' ? 1 : -1);
    } else {
      if (typeof aVal !== 'string') {
        aVal = String(aVal);
      }
      if (typeof bVal !== 'string') {
        bVal = String(bVal);
      }
      return aVal.localeCompare(bVal) * (props.sortDir === 'asc' ? 1 : -1);
    }
  });
});


const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("de-DE");
};

const formatCurrency = (amount) => {
  return amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
};

async function fetchKosten() {
  try {
    const { data, error } = await $supabase
      .from("fahrzeug_kosten")
      .select("*")
      .eq("fahrzeug_fin", route.query.fin)
      .order("datum", { ascending: false }); // Initiale Sortierung nach Datum absteigend

    if (error) {
      throw error;
    }

    kostenListe.value = data;
  } catch (err) {
    console.error("[ERROR] Fehler beim Abrufen der Kosten:", err);
  }
}

const editEntry = (entry) => {
  emit('edit', entry);
};

const deleteEntry = async (id) => {
  if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
    return;
  }

  try {
    const { error } = await $supabase
      .from('fahrzeug_kosten')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchKosten();
    emit('update');
  } catch (error) {
    console.error("[ERROR] Fehler beim Löschen der Kosten:", error);
    alert("Fehler beim Löschen der Kosten.");
  }
};

const yearlyTotal = computed(() =>
  kostenListe.value.reduce((sum, item) => sum + item.betrag, 0)
);

const monthlyAverage = computed(() => yearlyTotal.value / 12);

const highestCost = computed(() =>
  Math.max(...kostenListe.value.map((item) => item.betrag))
);

onMounted(fetchKosten);
</script>