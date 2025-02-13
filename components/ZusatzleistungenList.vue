<template>
    <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Zusatzleistungen</h3>
            <button @click="openModal" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">
                Zusatzleistung hinzufügen
            </button>
        </div>

        <div class="mb-4 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Titel
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deckungssumme
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Beschreibung
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gültig von
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gültig bis
                        </th>
                        <th class="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="zusatz in zusatzleistungen" :key="zusatz.zusatzid">
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ zusatz.zusatztitel }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ formatCurrency(zusatz.zusatz_deckungssumme) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ zusatz.zusatzbeschreibung || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ formatDate(zusatz.gueltig_von) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ formatDate(zusatz.gueltig_bis) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button @click="editZusatz(zusatz)" class="text-blue-600 hover:text-blue-900 mr-2">
                                ✏️
                            </button>
                            <button @click="deleteZusatz(zusatz.zusatzid)" class="text-red-600 hover:text-red-900">
                                🗑️
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal :isOpen="showModal" :title="modalTitle" @close="closeModal" @save="saveZusatz">
            <template #body>
                <div class="space-y-4">
                    <div class="flex flex-col">
                        <label class="block text-sm font-medium text-gray-700">Titel *</label>
                        <input type="text" v-model="currentZusatz.zusatztitel"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required />
                    </div>

                    <div class="flex flex-col">
                        <label class="block text-sm font-medium text-gray-700">Deckungssumme *</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">€</span>
                            </div>
                            <input type="number" v-model="currentZusatz.zusatz_deckungssumme"
                                class="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                step="0.01" min="0" required />
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <label class="block text-sm font-medium text-gray-700">Beschreibung</label>
                        <textarea v-model="currentZusatz.zusatzbeschreibung" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <label class="block text-sm font-medium text-gray-700">Gültig von *</label>
                            <input type="date" v-model="currentZusatz.gueltig_von"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required />
                        </div>

                        <div class="flex flex-col">
                            <label class="block text-sm font-medium text-gray-700">Gültig bis *</label>
                            <input type="date" v-model="currentZusatz.gueltig_bis"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required />
                        </div>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import Modal from './Modal.vue';

const props = defineProps({
    versicherungId: {
        type: Number,
        required: true
    }
});

const { $supabase } = useNuxtApp();
const zusatzleistungen = ref([]);
const showModal = ref(false);
const currentZusatz = ref({
    zusatztitel: '',
    zusatz_deckungssumme: null,
    zusatzbeschreibung: '',
    gueltig_von: '',
    gueltig_bis: '',
    versicherung_id: props.versicherungId
});

const modalTitle = ref('Zusatzleistung hinzufügen');

const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-';
};

const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('de-DE') : '-';
};

const fetchZusatzleistungen = async () => {
    try {
        const { data, error } = await $supabase
            .from('zusatzleistungen')
            .select(`
        *,
        versicherung_zusatzleistungen (
          gueltig_von,
          gueltig_bis
        )
      `)
            .eq('versicherung_id', props.versicherungId);

        if (error) throw error;

        zusatzleistungen.value = data.map(zusatz => ({
            ...zusatz,
            gueltig_von: zusatz.versicherung_zusatzleistungen[0]?.gueltig_von,
            gueltig_bis: zusatz.versicherung_zusatzleistungen[0]?.gueltig_bis
        }));
    } catch (error) {
        console.error('Error fetching Zusatzleistungen:', error);
        alert('Fehler beim Laden der Zusatzleistungen');
    }
};

const openModal = () => {
    currentZusatz.value = {
        zusatztitel: '',
        zusatz_deckungssumme: null,
        zusatzbeschreibung: '',
        gueltig_von: '',
        gueltig_bis: '',
        versicherung_id: props.versicherungId
    };
    modalTitle.value = 'Zusatzleistung hinzufügen';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const editZusatz = (zusatz) => {
    currentZusatz.value = { ...zusatz };
    modalTitle.value = 'Zusatzleistung bearbeiten';
    showModal.value = true;
};

const saveZusatz = async () => {
    try {
        let zusatzData = {
            versicherung_id: props.versicherungId,
            zusatztitel: currentZusatz.value.zusatztitel,
            zusatz_deckungssumme: currentZusatz.value.zusatz_deckungssumme,
            zusatzbeschreibung: currentZusatz.value.zusatzbeschreibung
        };

        let zusatzId;

        if (currentZusatz.value.zusatzid) {
            const { error } = await $supabase
                .from('zusatzleistungen')
                .update(zusatzData)
                .eq('zusatzid', currentZusatz.value.zusatzid);

            if (error) throw error;
            zusatzId = currentZusatz.value.zusatzid;
        } else {
            const { data, error } = await $supabase
                .from('zusatzleistungen')
                .insert(zusatzData)
                .select('zusatzid')
                .single();

            if (error) throw error;
            zusatzId = data.zusatzid;
        }

        const validityData = {
            versicherung_id: props.versicherungId,
            zusatzid: zusatzId,
            gueltig_von: currentZusatz.value.gueltig_von,
            gueltig_bis: currentZusatz.value.gueltig_bis
        };

        const { error: validityError } = await $supabase
            .from('versicherung_zusatzleistungen')
            .upsert(validityData);

        if (validityError) throw validityError;

        await fetchZusatzleistungen();
        closeModal();
    } catch (error) {
        console.error('Error saving Zusatzleistung:', error);
        alert('Fehler beim Speichern der Zusatzleistung');
    }
};

const deleteZusatz = async (zusatzId) => {
    if (!confirm('Möchten Sie diese Zusatzleistung wirklich löschen?')) {
        return;
    }

    try {
        const { error } = await $supabase
            .from('zusatzleistungen')
            .delete()
            .eq('zusatzid', zusatzId);

        if (error) throw error;

        await fetchZusatzleistungen();
    } catch (error) {
        console.error('Error deleting Zusatzleistung:', error);
        alert('Fehler beim Löschen der Zusatzleistung');
    }
};

onMounted(fetchZusatzleistungen);
</script>