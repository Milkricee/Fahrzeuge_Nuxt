<template>
  <div class="p-4">
    <div class="bg-primary-50 bg-opacity-85 border border-primary-200 rounded-lg p-6 shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-semibold text-primary-600">Versicherungsliste</h1>
        <NuxtLink to="/versicherung/add"
          class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          Versicherung hinzufügen
        </NuxtLink>
      </div>
      <div class="mb-4">
        <insuranceList /> 
      </div>
    </div>
  </div>
</template>

<script setup>
import InsuranceList from '~/components/insuranceList.vue';
</script>