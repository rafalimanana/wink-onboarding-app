<template>
  <div class="animate-fade-in text-center">
    <p class="text-gray-600 mb-8">
      Il s'agit de la dernière étape ! Toutes vos données sont prêtes à être enregistrées.
    </p>

    <div class="p-6 bg-gray-50 rounded-lg text-left mb-8">
      <h4 class="font-bold text-gray-700 mb-3">Résumé :</h4>
      <p class="text-sm">
        <span class="font-medium">Utilisateur :</span> {{ userStore.firstName }} {{ userStore.lastName }} ({{ userStore.email }})
      </p>
      <p class="text-sm">
        <span class="font-medium">Espace :</span> {{ workspaceStore.name }} ({{ workspaceStore.website }})
      </p>
    </div>
    <div class="flex justify-between items-center">
        <button @click="onboardingStore.prevStep()" class="px-6 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 flex items-center space-x-2 transition duration-150">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6666 10H3.33325M3.33325 10L8.33325 15M3.33325 10L8.33325 5" stroke="#475467" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Retour</span>
        </button>
        <UButton type="submit" class="btn-primary w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            {{ $t('common.continue') }}
        </UButton>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { useOnboardingStore } from '@/store/onboarding';
import { useWorkspaceStore } from '@/store/workspace';
// Importation de TOUS les stores, car nous allons envoyer toutes les données.
const userStore = useUserStore();
const workspaceStore = useWorkspaceStore();
const onboardingStore = useOnboardingStore();

// Fonction de soumission
const submitRegistration = () => {
  const finalPayload = {
    user: userStore.$state,
    workspace: workspaceStore.$state,
  }
  
  // ICI : En temps normal, vous feriez un appel API Fastify.
  console.log('Soumission des données finales (Simulé):', finalPayload);

  // Redirection ou affichage de succès
  alert('Inscription finalisée ! Données enregistrées (en mémoire).');
}
</script>