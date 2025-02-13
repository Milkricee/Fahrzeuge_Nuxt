<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" v-if="isOpen">
    <div class="rounded-lg border border-primary-200 bg-primary-50 bg-opacity-100 shadow-lg w-96">
      <header class="px-4 py-2 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">&times;</button>
      </header>
      <section class="px-4 py-2">
        <slot name="body"></slot> 
      </section>
      <footer class="px-4 py-2 border-t flex justify-end">
        <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">Abbrechen</button>
        <button @click="handleSave" class="bg-primary-500 text-white px-4 py-2 rounded-md">Speichern</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  formData: Object,
});

const emit = defineEmits(['close', 'save']);

const closeModal = () => emit('close');
const handleSave = () => emit('save', props.formData); 
</script>