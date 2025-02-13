<template>
  <header class="bg-primary-50 p-4 shadow-custom">
    <nav class="flex items-center space-x-4">
      <img src="/assets/images/AI_logo.png" alt="Logo" class="h-8 w-auto" />

      <ul class="flex space-x-4">
        <li>
          <NuxtLink to="/kfz/fahrzeuge" 
            class="px-3 py-2 bg-primary-50 rounded hover:bg-primary-200 text-primary-800 hover:text-black transition-colors duration-300 font-bold">
            Fuhrpark
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/versicherung" @click.prevent="goToVersicherung" 
            class="px-3 py-2 bg-primary-50 rounded hover:bg-primary-200 text-primary-800 hover:text-black transition-colors duration-300 font-bold">
            Versicherung
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { navigateTo } from '#app';
import { resetFahrzeugList } from '~/composables/fahrzeugHelper'; // Importiere aus fahrzeugHelper.js

async function goToVersicherung() {
  await resetFahrzeugList(); // Warten, bis resetFahrzeugList abgeschlossen ist
  navigateTo('/versicherung');
}
</script>