<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header WINK -->
    <AppHeader />

    <!-- Slot pour les pages (index.vue) -->
    <main class="w-full max-w-5xl px-4 py-4 pb-16 pt-8 mx-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
</script>
