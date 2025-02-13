<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium">Reparaturhistorie</h3>
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
              @click="$emit('sort', 'kilometerstand', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Kilometerstand
              <span v-if="sortKey === 'kilometerstand'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'kosten', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Kosten
              <span v-if="sortKey === 'kosten'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th 
              @click="$emit('sort', 'status', sortDir === 'asc' ? 'desc' : 'asc')" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Status
              <span v-if="sortKey === 'status'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="reparatur in sortedReparaturen" :key="reparatur.id">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(reparatur.datum) }}
            </td>
            <td class="px-6 py-4">{{ reparatur.beschreibung }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ reparatur.kilometerstand.toLocaleString() }} km
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatCurrency(reparatur.kosten) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'px-2 py-1 rounded text-sm font-medium': true,
                'bg-green-100 text-green-800': reparatur.status === 'abgeschlossen',
                'bg-yellow-100 text-yellow-800': reparatur.status === 'offen',
              }">
                {{ reparatur.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editEntry(reparatur)" class="text-blue-600 hover:text-blue-900 mr-2">
                ✏️
              </button>
              <button @click="deleteEntry(reparatur.id)" class="text-red-600 hover:text-red-900">
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

const reparaturen = ref([]);
const props = defineProps({
  sortKey: String,
  sortDir: String,
});

//  sortedReparaturen computed property hinzufügen
const sortedReparaturen = computed(() => {
  if (!props.sortKey) {
    return reparaturen.value;
  }
  return [...reparaturen.value].sort((a, b) => {
    let aVal = a[props.sortKey];
    let bVal = b[props.sortKey];
    //  Wenn die zu sortierende Spalte "kosten" ist, 
    //  verwende numerische Sortierung, sonst String-Sortierung
    if (props.sortKey === 'kosten') {
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

async function fetchReparaturen() {
  try {
    const { data, error } = await $supabase
      .from("fahrzeug_reparaturen")
      .select("*")
      .eq("fahrzeug_fin", route.query.fin)
      .order("datum", { ascending: false });

    if (error) {
      throw error;
    }

    reparaturen.value = data;
  } catch (err) {
    console.error("[ERROR] Fehler beim Abrufen der Reparaturen:", err);
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
      .from('fahrzeug_reparaturen')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchReparaturen();
    emit('update');
  } catch (error) {
    console.error("[ERROR] Fehler beim Löschen der Reparatur:", error);
    alert("Fehler beim Löschen der Reparatur.");
  }
};

onMounted(fetchReparaturen);
</script>