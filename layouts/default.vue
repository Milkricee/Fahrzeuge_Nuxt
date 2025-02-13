<template>
    <div>
      <Header />
      <!-- Body -->
      <div class="relative flex-grow">
        <!-- Transparentes Hintergrundbild -->
        <div class="absolute inset-0 bg-body-background bg-contain bg-no-repeat min-h-screen opacity-25"></div>
        <!-- Inhalt -->
        <div class="relative z-10">
          <NuxtPage />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Header from '~/components/Header.vue'; 
  </script>
  