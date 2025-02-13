<template>
    <div class="mb-4 mt-2 p-4 rounded-lg border border-primary-200 bg-primary-50 bg-opacity-85 max-w-xl w-full shadow-md">
      <h2 class="text-xl font-semibold mb-2">Fahrzeugdetails</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p>
            <span class="font-medium">Kennzeichen:</span>
            {{ fahrzeug.kennzeichen }}
          </p>
          <p>
            <span class="font-medium">Marke/Modell:</span>
            {{ fahrzeug.marke }} {{ fahrzeug.modell }}
          </p>
        </div>
        <div>
          <p><span class="font-medium">FIN:</span> {{ fahrzeug.fin }}</p>
          <p>
            <span class="font-medium">Erstzulassung:</span>
            {{ fahrzeug.erstzulassung }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    fahrzeug: {
      type: Object,
      required: true
    }
  });
  </script>