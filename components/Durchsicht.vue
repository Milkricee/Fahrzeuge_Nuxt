<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium">Durchsichthistorie</h3>
    </div>
    <div class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
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
              @click="$emit('sort', 'km', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Kilometerstand
              <span v-if="sortKey === 'km'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'anmerkungen', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Anmerkungen
              <span v-if="sortKey === 'anmerkungen'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="durchsicht in sortedDurchsichten" :key="durchsicht.id">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(durchsicht.datum) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ durchsicht.km.toLocaleString() }} km
            </td>
            <td class="px-6 py-4">
              {{ durchsicht.anmerkungen || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editEntry(durchsicht)" class="text-blue-600 hover:text-blue-900 mr-2">
                ✏️
              </button>
              <button @click="deleteEntry(durchsicht.id)" class="text-red-600 hover:text-red-900">
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
import { ref, onMounted, computed } from "vue";
import { useNuxtApp, useRoute } from "#app";

const { $supabase } = useNuxtApp();
const route = useRoute();

const emit = defineEmits(['update', 'edit', 'sort']);

const durchsichten = ref([]);
const props = defineProps({
  sortKey: String,
  sortDir: String,
});

//  sortedDurchsichten computed property hinzufügen
const sortedDurchsichten = computed(() => {
  if (!props.sortKey) {
    return durchsichten.value;
  }
  return [...durchsichten.value].sort((a, b) => {
    let aVal = a[props.sortKey];
    let bVal = b[props.sortKey];
    //  Sicherstellen, dass aVal und bVal Strings sind
    if (typeof aVal !== 'string') {
      aVal = String(aVal);
    }
    if (typeof bVal !== 'string') {
      bVal = String(bVal);
    }
    return aVal.localeCompare(bVal) * (props.sortDir === 'asc' ? 1 : -1);
  });
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("de-DE");
};

async function fetchDurchsicht() {
  try {
    const { data, error } = await $supabase
      .from("durchsicht")
      .select("*")
      .eq("fin", route.query.fin)
      .order("datum", { ascending: false });

    if (error) {
      throw error;
    }

    durchsichten.value = data;
  } catch (err) {
    console.error("[ERROR] Fehler beim Abrufen der Durchsichten:", err);
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
      .from('durchsicht')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchDurchsicht();
    emit('update');
  } catch (error) {
    console.error("[ERROR] Fehler beim Löschen der Durchsicht:", error);
    alert("Fehler beim Löschen der Durchsicht.");
  }
};

onMounted(fetchDurchsicht);
</script>