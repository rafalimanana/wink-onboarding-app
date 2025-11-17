<template>
  <div class="w-full h-full md:max-w-sm border border-gray-200 bg-gray-50 rounded-xl shadow-lg relative overflow-hidden p-4 justify-center items-center">
    <div class="flex justify-center items-center mb-4">
      <span class="text-sm font-bold tracking-wider text-gray-900 uppercase">WINK</span>
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-bell" class="text-gray-400" />
        <UIcon name="i-heroicons-question-mark-circle" class="text-gray-400" />
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-inner h-[88%] p-4 border border-gray-200">
      
      <template v-if="onboardingStore.currentStep >= 1">
        <h3 class="text-xs font-semibold text-gray-400 uppercase mb-3">{{ $t('preview.profile') }}</h3>
        <div class="w-full p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <UAvatar :src="userStore.avatarUrl" size="md" />
            <div>
              <p class="font-medium text-sm text-gray-900">{{ userStore.firstName }} {{ userStore.lastName }}</p>
              <p class="text-xs text-gray-500">{{ userStore.email }}</p>
            </div>
          </div>
          <UIcon name="i-heroicons-chevron-down" class="text-gray-400" />
        </div>
      </template>

      <template v-if="onboardingStore.currentStep >= 2">
        <h3 class="text-xs font-semibold text-gray-400 uppercase mt-5 mb-3">{{ $t('preview.workspace') }}</h3>
        <div class="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div class="flex items-center space-x-3 space-y-3">
            <UAvatar :src="workspaceStore.logoUrl" size="sm" class="p-2 bg-white" />
            <div>
              <p class="font-medium text-sm text-blue-700">{{ workspaceStore.name || $t('preview.defaultCompany') }}</p>
            </div>
          </div>
          <UIcon name="i-heroicons-check-circle" class="text-blue-600" />
        </div>
        
        <div class="mt-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { useOnboardingStore } from '@/store/onboarding';
import { useWorkspaceStore } from '@/store/workspace';

const userStore = useUserStore();
const workspaceStore = useWorkspaceStore();
const onboardingStore = useOnboardingStore();
</script>
