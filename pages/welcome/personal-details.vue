<template>
    <div class="bg-white p-8 sm:p-12 md:p-16 rounded-3xl transition-all duration-500 ease-in-out">
        <!-- Stepper -->
        <RegistrationStepper :current-step="onboardingStore.currentStep" @step-change="goToStep" />
        <!-- Contenu des étapes -->
        <div v-if="onboardingStore.currentStep === 1">
            <h2 class="text-3xl font-semibold text-gray-900 mb-8 title_page">{{ $t('common.step1') }}</h2>
        </div>
        <div v-if="onboardingStore.currentStep === 2">
            <h2 class="text-3xl font-semibold text-gray-900 mb-8 title_page">{{ $t('common.step2') }}</h2>
        </div>
        <div v-if="onboardingStore.currentStep === 3">
            <h2 class="text-3xl font-semibold text-gray-900 mb-6 title_page">{{ $t('common.step3') }}</h2>
        </div>
        <div class="step-content grid md:grid-cols-2 gap-12">
            <!-- Étape 1 -->
            <Step1Profile v-if="onboardingStore.currentStep === 1" @next-step="goToStep(2)" />
            <!-- Étape 2 -->
            <Step2Workspace v-if="onboardingStore.currentStep === 2" @prev-step="goToStep(1)" @next-step="goToStep(3)" />
            <!-- Étape 3 -->
            <Step3Finalization v-if="onboardingStore.currentStep === 3" @prev-step="goToStep(2)" />
            <!-- Aperçu (sidebar) -->
            <div class="order-1 md:order-2 flex justify-center items-start">
                <div class="col_right_preview">
                    <div v-if="onboardingStore.currentStep === 1">
                        <div v-if="fullName && avatar">
                            <IllustrationStepOne
                              :fullName="fullName"
                              :avatar="avatar"
                            />
                        </div>
                        <div v-else>
                            <IllustrationWithoutProfil
                              :fullName="fullName"
                              :shortName="shortName"
                            />
                        </div>
                    </div>
                    <div v-else-if="onboardingStore.currentStep === 2" class="mt-12">
                        <div v-if="companyName && logo_url">
                            <IllustrationStepTwo
                              :fullName="fullName"
                              :avatar="avatar"
                              :logo="logo_url"
                              :companyName="companyName"
                            />
                        </div>
                        <div v-else>
                            <IllustrationWithoutCompany
                              :fullName="fullName"
                              :companyName="companyName"
                              :avatar="avatar"
                            />
                        </div>
                    </div>
                    <div v-else>
                        <AppPreview :current-step="onboardingStore.currentStep" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOnboardingStore } from '@/store/onboarding';
import { useUserStore } from '@/store/user';
import { useWorkspaceStore } from '@/store/workspace';

import RegistrationStepper from '@/components/registration/RegistrationStepper.vue';
import Step1Profile from '@/components/registration/Step1Profile.vue';
import Step2Workspace from '@/components/registration/Step2Workspace.vue';
import Step3Finalization from '@/components/registration/Step3Finalization.vue';
import AppPreview from '@/components/layout/AppPreview.vue';
import IllustrationStepOne from '@/components/layout/IllustrationStepOne.vue';
import IllustrationStepTwo from '@/components/layout/IllustrationStepTwo.vue';
import IllustrationWithoutCompany from '@/components/layout/IllustrationWithoutCompany.vue';
import IllustrationWithoutProfil from '@/components/layout/IllustrationWithoutProfil.vue';

const onboardingStore = useOnboardingStore();
const userStore = useUserStore();
const workspaceStore = useWorkspaceStore();

const currentStep = ref(onboardingStore.currentStep || 1);

const fullName = computed(() => userStore.firstName + " " + userStore.lastName);
const shortName = computed(() => {
  const first = userStore.firstName?.trim() || "";
  const last = userStore.lastName?.trim() || "";

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
});
const avatar = computed(() => userStore.avatarUrl);
const logo_url = computed(() => workspaceStore.logoUrl);
const companyName = computed(() => workspaceStore.name);

onMounted(async () => {
  await workspaceStore.prefillFromEmail(userStore.email);
});

function goToStep(step: number) {
    currentStep.value = step;
    onboardingStore.goToStep(step);
}
</script>
<style scoped>
.col_right_preview {
    min-width: calc(100%);
    height: 100%;
    margin-left: 137px;
}

@media (max-width: 768px) {
    .col_right_preview {
        margin-left: 0;
    }
}

@media (max-width: 767px) {
    .title_page {
        text-align: center;
    }
}
</style>