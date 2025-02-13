<template>
  <div class="space-y-4"> 
    <div class="flex justify-between items-center"> 
      <h3 class="text-lg font-medium">Schadenhistorie</h3> 
    </div> 
    <div class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 overflow-x-auto"> 
      <table class="min-w-full divide-y divide-gray-200"> 
        <thead class="bg-gray-50"> 
          <tr> 
            <th  
              @click="$emit('sort', 'created_at', sortDir === 'asc' ? 'desc' : 'asc')"  
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
            > 
              Erstellt am 
              <span v-if="sortKey === 'created_at'"> 
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
              @click="$emit('sort', 'schadensart', sortDir === 'asc' ? 'desc' : 'asc')"  
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
            > 
              Schadensart 
              <span v-if="sortKey === 'schadensart'"> 
                <span v-if="sortDir === 'asc'">▲</span> 
                <span v-else>▼</span> 
              </span> 
            </th> 
            <th  
              @click="$emit('sort', 'fahrer', sortDir === 'asc' ? 'desc' : 'asc')"  
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
            > 
              Fahrer 
              <span v-if="sortKey === 'fahrer'"> 
                <span v-if="sortDir === 'asc'">▲</span> 
                <span v-else>▼</span> 
              </span> 
            </th> 
            <th  
              @click="$emit('sort', 'eigenverschulden', sortDir === 'asc' ? 'desc' : 'asc')"  
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
            > 
              Eigenverschulden 
              <span v-if="sortKey === 'eigenverschulden'"> 
                <span v-if="sortDir === 'asc'">▲</span> 
                <span v-else>▼</span> 
              </span> 
            </th> 
            <th  
              @click="$emit('sort', 'gemeldet', sortDir === 'asc' ? 'desc' : 'asc')"  
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
            > 
              Gemeldet 
              <span v-if="sortKey === 'gemeldet'"> 
                <span v-if="sortDir === 'asc'">▲</span> 
                <span v-else>▼</span> 
              </span> 
            </th> 
            <th  
              @click="$emit('sort', 'hoehe_des_schadens', sortDir === 'asc' ? 'desc' : 'asc')"  
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
            > 
              Höhe des Schadens 
              <span v-if="sortKey === 'hoehe_des_schadens'"> 
                <span v-if="sortDir === 'asc'">▲</span> 
                <span v-else>▼</span> 
              </span> 
            </th> 
            <th class="px-6 py-3"></th> 
          </tr> 
        </thead> 
        <tbody class="bg-white divide-y divide-gray-200"> 
          <tr v-for="schaden in sortedSchaeden" :key="schaden.id"> 
            <td class="px-6 py-4 whitespace-nowrap"> 
              {{ formatDate(schaden.created_at) }} 
            </td> 
            <td class="px-6 py-4">{{ schaden.beschreibung }}</td> 
            <td class="px-6 py-4 whitespace-nowrap"> 
              {{ schaden.schadensart }} 
            </td> 
            <td class="px-6 py-4 whitespace-nowrap"> 
              {{ schaden.fahrer }} 
            </td> 
            <td class="px-6 py-4 whitespace-nowrap"> 
              <span v-if="schaden.eigenverschulden">Ja</span> 
              <span v-else>Nein</span> 
            </td> 
            <td class="px-6 py-4 whitespace-nowrap"> 
              <span v-if="schaden.gemeldet">Ja</span> 
              <span v-else>Nein</span> 
            </td> 
            <td class="px-6 py-4 whitespace-nowrap"> 
              {{ formatCurrency(schaden.hoehe_des_schadens) }} 
            </td> 
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"> 
              <button @click="editEntry(schaden)" class="text-blue-600 hover:text-blue-900 mr-2"> 
                ✏️ 
              </button> 
              <button @click="deleteEntry(schaden.id)" class="text-red-600 hover:text-red-900"> 
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

const schaeden = ref([]); 
const props = defineProps({ 
  sortKey: String, 
  sortDir: String, 
}); 

//  sortedSchaeden computed property hinzufügen 
const sortedSchaeden = computed(() => { 
  if (!props.sortKey) { 
    return schaeden.value; 
  } 
  return [...schaeden.value].sort((a, b) => { 
    let aVal = a[props.sortKey]; 
    let bVal = b[props.sortKey]; 
    //  Wenn die zu sortierende Spalte "hoehe_des_schadens" ist,  
    //  verwende numerische Sortierung, sonst String-Sortierung 
    if (props.sortKey === 'hoehe_des_schadens') { 
      return (aVal - bVal) * (props.sortDir === 'asc' ? 1 : -1); 
    } else if (props.sortKey === 'eigenverschulden' || props.sortKey === 'gemeldet') {
      //  Boolean-Werte sortieren
      aVal = aVal ? 1 : 0;
      bVal = bVal ? 1 : 0;
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

async function fetchSchaeden() { 
  try { 
    const { data, error } = await $supabase 
      .from("fahrzeug_schaeden") 
      .select("*") 
      .eq("fin", route.query.fin) 
      .order("created_at", { ascending: false }); 

    if (error) { 
      throw error; 
    } 

    schaeden.value = data; 
  } catch (err) { 
    console.error("[ERROR] Fehler beim Abrufen der Schäden:", err); 
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
      .from('fahrzeug_schaeden') 
      .delete() 
      .eq('id', id); 

    if (error) throw error; 

    await fetchSchaeden(); 
    emit('update'); 
  } catch (error) { 
    console.error("[ERROR] Fehler beim Löschen des Schadens:", error); 
    alert("Fehler beim Löschen des Schadens."); 
  } 
}; 

onMounted(fetchSchaeden); 
</script>