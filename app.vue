<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup lang="ts">
// Vous pouvez définir ici des métadonnées globales
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - WINK App` : 'WINK App';
  },
  meta: [
    { name: 'description', content: 'Parcours d\'inscription WINK' }
  ],
})
</script>