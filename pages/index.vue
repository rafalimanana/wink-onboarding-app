<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#app'

const { locale } = useI18n();
navigateTo(`/${locale.value}/welcome/personal-details`)
</script>

<template>
  <!-- Page vide car la redirection est immédiate -->
</template>
