<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Fahrzeughistorie und Berichte</h1>
    <div v-if="loading" class="text-center py-4">Lade Fahrzeugdaten...</div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="!fahrzeug" class="text-center py-4">
      Fahrzeug nicht gefunden
    </div>
    <div v-else class="space-y-6">
      <FahrzeugDetails :fahrzeug="fahrzeug" />

      <div class="flex justify-between items-center border-b">
        <div class="flex">
          <button v-for="(tab, index) in tabs" :key="index" @click="setActiveTab(tab.id)" :class="[
            'px-4 py-2 font-medium',
            activeTab === tab.id
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-gray-600',
          ]">
            {{ tab.name }}
          </button>
        </div>
        <button @click="openModal" class="bg-primary-500 text-white px-3 py-2 rounded-md">
          Hinzufügen
        </button>
      </div>

      <Modal :isOpen="isModalOpen" :title="modalTitle" :formData="formData" @close="closeModal" @save="submitEntry">
        <template #body>
          <form @submit.prevent="submitEntry" id="entryForm" ref="formRef" class="space-y-4 p-2">
            <component :is="activeTabFormComponent" :formData="formData" :activeTab="activeTab" />
          </form>
        </template>
      </Modal>

      <Wartungen v-if="activeTab === 'Wartungen'" :fahrzeug="fahrzeug" @update="fetchData" @edit="editEntry"
        :sortKey="sortKey" :sortDir="sortDir" @sort="updateSort" />
      <Reparaturen v-if="activeTab === 'Reparaturen'" :fahrzeug="fahrzeug" @update="fetchData" @edit="editEntry"
        :sortKey="sortKey" :sortDir="sortDir" @sort="updateSort" />
      <Kosten v-if="activeTab === 'Kosten'" :fahrzeug="fahrzeug" @update="fetchData" @edit="editEntry"
        :sortKey="sortKey" :sortDir="sortDir" @sort="updateSort" />
      <Durchsicht v-if="activeTab === 'Durchsicht'" :fahrzeug="fahrzeug" @update="fetchData" @edit="editEntry"
        :sortKey="sortKey" :sortDir="sortDir" @sort="updateSort" />
      <Schaeden v-if="activeTab === 'Schaeden'" :fahrzeug="fahrzeug" @update="fetchData" @edit="editEntry"
        :sortKey="sortKey" :sortDir="sortDir" @sort="updateSort" />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useNuxtApp, useRoute } from "#app";
import Modal from "~/components/Modal.vue";
import FahrzeugDetails from "~/components/FahrzeugDetails.vue";
import Wartungen from "~/components/Wartungen.vue";
import Reparaturen from "~/components/Reparaturen.vue";
import Kosten from "~/components/Kosten.vue";
import Durchsicht from "~/components/Durchsicht.vue";
import Schaeden from "~/components/Schaeden.vue"; //  Schaeden importieren
import WartungenForm from "~/components/WartungenForm.vue";
import ReparaturenForm from "~/components/ReparaturenForm.vue";
import KostenForm from "~/components/KostenForm.vue";
import DurchsichtForm from "~/components/DurchsichtForm.vue";
import SchaedenForm from "~/components/SchaedenForm.vue"; //  SchaedenForm importieren

const { $supabase } = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const error = ref(null);
const fahrzeug = ref(null);
const activeTab = ref("Wartungen");

const isModalOpen = ref(false);
const formData = ref({});
const sortKey = ref(null);
const sortDir = ref('asc');

const tabs = [
  { id: "Wartungen", name: "Wartungen", formComponent: WartungenForm },
  { id: "Reparaturen", name: "Reparaturen", formComponent: ReparaturenForm },
  { id: "Kosten", name: "Kosten", formComponent: KostenForm },
  { id: "Durchsicht", name: "Durchsicht", formComponent: DurchsichtForm },
  { id: "Schaeden", name: "Schäden", formComponent: SchaedenForm }, //  Schaeden Tab hinzufügen
];

const activeTabFormComponent = computed(() => tabs.find(tab => tab.id === activeTab.value).formComponent);

const modalTitle = computed(() => {
  return formData.value.id
    ? `${activeTab.value} bearbeiten`
    : `Neuen Eintrag hinzufügen - ${activeTab.value}`;
});

const openModal = () => {
  formData.value = {};
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (!route.query.fin) {
      error.value = "Keine FIN gefunden. Bitte wähle ein Fahrzeug aus.";
      return;
    }

    const { data, error: dbError } = await $supabase
      .from("fahrzeuge")
      .select("*")
      .eq("fin", route.query.fin)
      .single();

    if (dbError) {
      throw dbError;
    }

    fahrzeug.value = data;

  } catch (e) {
    error.value = "Ein Problem ist aufgetreten. Bitte versuche es später erneut.";
  } finally {
    loading.value = false;
  }
};

const submitEntry = async () => {
  try {
    let tableName;
    let data = { ...formData.value };

    // Tab-spezifische Tabellenzuordnung und Feldbereinigung
    if (activeTab.value === "Wartungen") {
      tableName = "fahrzeug_wartungen";
      data.fahrzeug_fin = fahrzeug.value.fin;
    } else if (activeTab.value === "Reparaturen") {
      tableName = "fahrzeug_reparaturen";
      data.fahrzeug_fin = fahrzeug.value.fin;
    } else if (activeTab.value === "Kosten") {
      tableName = "fahrzeug_kosten";
      data.fahrzeug_fin = fahrzeug.value.fin;
    } else if (activeTab.value === "Durchsicht") {
      tableName = "durchsicht";
      data.fin = fahrzeug.value.fin;

      // Entferne Felder, die in der 'durchsicht'-Tabelle nicht existieren
      delete data.eigenverschulden;
      delete data.gemeldet;
      delete data.hoehe_des_schadens;

      console.log("Daten für Durchsicht nach Bereinigung:", data);
    } else if (activeTab.value === "Schaeden") {
      tableName = "fahrzeug_schaeden";
      data.fin = fahrzeug.value.fin;

      // Felder wie `eigenverschulden` und `gemeldet` sind spezifisch für Schäden
      if (data.eigenverschulden === undefined) {
        data.eigenverschulden = false;
      }
      if (data.gemeldet === undefined) {
        data.gemeldet = false;
      }

      console.log("Daten für Schäden:", data);
    }

    // Überprüfe, ob eine Tabelle festgelegt wurde
    if (!tableName) {
      console.error("Kein Tabellenname gefunden.");
      return;
    }

    let error;

    if (data.id) {
      const id = data.id;
      delete data.id;
      ({ error } = await $supabase
        .from(tableName)
        .update(data)
        .eq("id", id));
    } else {
      ({ error } = await $supabase
        .from(tableName)
        .insert([data]));
    }

    if (error) {
      throw error;
    }

    fetchData();
    closeModal();
    console.log("Erfolgreich in der Tabelle gespeichert:", tableName); // Debugging: Erfolgsmeldung
    fetchData();
    closeModal();
  } catch (e) {
    console.error("Unerwarteter Fehler:", e); // Debugging: Allgemeiner Fehler
    alert("Ein unerwarteter Fehler ist aufgetreten: " + e.message);
  }
};


const editEntry = (entry) => {
  formData.value = { ...entry };
  isModalOpen.value = true;
};

const updateSort = (key, dir) => {
  sortKey.value = key;
  sortDir.value = dir;
};

//  setActiveTab Funktion hinzufügen
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  sortKey.value = null; //  Sortierung zurücksetzen
  sortDir.value = 'asc';
};

//  watch Effekt hinzufügen, um die Sortierung beim Tabwechsel zurückzusetzen
watch(activeTab, () => {
  sortKey.value = null;
  sortDir.value = 'asc';
});

onMounted(fetchData);
</script>