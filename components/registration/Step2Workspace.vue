<template>
    <div class="animate-fade-in order-2 md:order-1">
        <UForm :schema="workspaceSchema" :state="workspaceStore" @submit="handleStep2Submit">
            <div class="mb-7">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{$t('workspace.companyLogo')}}
                </label>
                <div class="flex items-center space-x-4">
                    <!-- Logo/Placeholder Peugeot -->
                    <div 
                        class="w-18 h-18 rounded-2xl flex items-center justify-center border p-2 borde_white text-gray font-semibold text-lg border-4 shadow-lg overflow-hidden"
                        :class="!workspaceStore.logoUrl ? 'bg-gray-200' : ''"
                    >
                        <UAvatar 
                            :src="workspaceStore.logoUrl ? workspaceStore.logoUrl : '/images/svg/default_icon_company.svg'"
                            class="object-cover w-full h-full text-3xl font-semibold text-gray-700"
                        />
                    </div>
                    <div class="flex flex-col space-y-2">
                        <div class="flex space-x-3">
                            <UButton 
                                class="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150" 
                                icon="i-lucide-upload" 
                                :label="workspaceStore.logoUrl ? $t('common.editPhoto') : $t('common.addPhoto')" 
                                @click="triggerUploadLogo" 
                            />
                            <UButton 
                                class="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
                                :class="!workspaceStore.logoUrl ? 'cursor-not-allowed' : ''"
                                :label="$t('common.deletePhoto')" 
                                :disabled="!workspaceStore.logoUrl" 
                                @click="deleteLogo"
                            />
                        </div>
                        <!-- Message d'erreur ou info -->
                        <p class="text-xs" :class="error ? 'text-red-500' : 'text-gray-500'">
                        {{ error || $t('common.formatPhoto') }}
                        </p>
                    </div>
                </div>
                 <!-- Input caché -->
                <input 
                  type="file" 
                  ref="fileInputLogo" 
                  class="hidden" 
                  @change="handleFileUploadLogo" 
                  accept="image/*"
                />
            </div>
            <div class="mb-7">
                <UFormField :label="$t('workspace.companyName')" name="companyName" required>
                    <UInput v-model="workspaceStore.name" :class="classInput()" :placeholder="$t('workspace.companyName')" size="xl" />
                </UFormField>
            </div>
            <div class="mb-7">
                <UFormField :label="$t('workspace.companyDescription')" name="description" required>
                    <UTextarea v-model="workspaceStore.description" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 placeholder-gray-400" :rows="4" :placeholder="$t('workspace.companyDescription')" />
                </UFormField>
            </div>
            <div class="mb-7">
                <UFormField :label="$t('workspace.website')" name="website" required>
                    <div class="flex">
                        <span class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">https://</span>
                        <UInput 
                            v-model="workspaceStore.website" 
                            @blur="workspaceStore.website = workspaceStore.cleanWebsiteInput(workspaceStore.website)"
                            :placeholder="$t('workspace.website')" 
                            :class="classInput()" 
                            class="flex-1" 
                            size="xl" 
                        />
                    </div>
                </UFormField>
            </div>
            <div class="mb-7">
                <UFormField :label="$t('workspace.hqAddress')" name="address" required>
                    <UInput v-model="workspaceStore.address" :class="classInput()" :placeholder="$t('workspace.plAddress')" size="xl" />
                </UFormField>
            </div>
            <div class="mb-7">
                <UFormField :label="$t('workspace.activitySector')" name="activitySector" required>
                    <UInput v-model="workspaceStore.activitySector" :class="classInput()" :placeholder="$t('workspace.plActivitySector')" size="xl" />
                </UFormField>
            </div>
            <div class="flex justify-between items-center">
                <button @click="onboardingStore.prevStep()" class="px-6 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 flex items-center space-x-2 transition duration-150 cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6666 10H3.33325M3.33325 10L8.33325 15M3.33325 10L8.33325 5" stroke="#475467" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Retour</span>
                </button>
                <UButton type="submit" class="btn-primary  w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl justify-center cursor-pointer">
                    {{ $t('common.continue') }}
                </UButton>
            </div>
        </UForm>
    </div>
</template>
<script setup lang="ts">
import { workspaceSchema, WorkspaceState, useWorkspaceStore } from '@/store/workspace';
import { useOnboardingStore } from '@/store/onboarding';
const workspaceStore = useWorkspaceStore();
const onboardingStore = useOnboardingStore();
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

// Appelée UNIQUEMENT si la validation Zod réussit
const handleStep2Submit = (event: { data: WorkspaceState }) => {
    console.log('Step 2 validé.', event.data);
    onboardingStore.nextStep();
}

const classInput = () => {
    return 'w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150'
}

const classLabel = () => {
    return 'block text-sm font-medium text-gray-700 mb-2'
}

const fileInputLogo = ref<HTMLInputElement | null>(null);
const error = ref('');

const triggerUploadLogo = () => {
  error.value = ''
  fileInputLogo.value?.click();
}

const handleFileUploadLogo = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // Vérifier le type de fichier
  if (!ALLOWED_TYPES.includes(file.type)) {
    error.value = 'Seuls les formats PNG et JPEG sont acceptés.'
    return
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    workspaceStore.logoUrl = e.target?.result as string;
    error.value = '' // reset erreur
  };
  reader.readAsDataURL(file);
}

const deleteLogo = () => {
  workspaceStore.logoUrl = '';
  error.value = '';
}
</script>
<style scoped>
.borde_white {
    border-color: #FFF;
}
</style>