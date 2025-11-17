<template>
    <div class="animate-fade-in order-2 md:order-1">
        <UForm :schema="userSchema" :state="userStore" @submit="handleStep1Submit" class="form_step_one">
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{$t('register.profilePhoto')}}
                </label>
                <div class="flex items-center space-x-4">
                    <div class="bloc_photo w-18 h-18 rounded-full flex items-center justify-center text-gray font-semibold text-lg border-2 borde_white shadow-md overflow-hidden">
                        <UAvatar 
                            v-if="!userStore.firstName && !userStore.lastName && !userStore.avatarUrl"
                            icon="i-lucide-image" 
                            size="md" 
                            class="object-cover w-full h-full text-3xl font-semibold text-gray-700 mt-2"
                        />
                        <UAvatar 
                            v-else
                            :src="userStore.avatarUrl" 
                            :alt="userName"
                            class="object-cover w-full h-full text-3xl font-semibold text-gray-700"
                        />
                    </div>
                    <div class="flex flex-col">
                        <div class="flex">
                            <!-- Upload / Edit Photo -->
                            <UButton
                              class="m-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 content_button"
                              icon="i-lucide-upload"
                              size="lg"
                              @click="triggerUpload"
                            >
                              {{ userStore.avatarUrl ? $t('common.editPhoto') : $t('common.addPhoto') }}
                            </UButton>

                            <!-- Supprimer photo -->
                            <UButton
                                class="m-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
                                :label="$t('common.deletePhoto')"
                                :class="!userStore.avatarUrl ? 'cursor-not-allowed' : 'cursor-pointer'"
                                :disabled="!userStore.avatarUrl" 
                                size="lg"
                                @click="deletePhoto"
                            />
                        </div>
                      <!-- Message d'erreur ou info -->
                      <p class="text-xs" :class="error ? 'text-red-500' : 'text-gray-500'">
                        {{ error || ($t('common.formatPhoto') + ' ' + $t('register.maxPhoto')) }}
                      </p>

                      <!-- Input caché pour l'upload -->
                      <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        @change="handleFileUpload"
                        accept=".png, .jpeg, .jpg"
                      />
                    </div>
                </div>
            </div>
            <div class="mb-6">
                <UFormField :label="$t('register.firstName')" name="firstName" required class="text-xs font-medium text-gray-700 content_label">
                    <UInput 
                        v-model="userStore.firstName" 
                        :class="classInput()" 
                        size="xl" 
                        :placeholder="$t('register.firstName')" 
                        class="text-sm font-regular"
                    />
                    <template #error="{ error }">
                      <p v-if="error" class="text-red-500 text-sm text-error">
                        {{ $t('error.user.firstName') }}
                      </p>
                    </template>
                </UFormField>
            </div>
            <div class="mb-6">
                <UFormField :label="$t('register.lastName')" name="lastName" required class="text-xs font-medium text-gray-700 content_label">
                    <UInput 
                        v-model="userStore.lastName" 
                        :class="classInput()" 
                        :placeholder="$t('register.lastName')" 
                        size="xl" 
                        class="text-sm font-regular"
                    />
                    <template #error="{ error }">
                      <p v-if="error" class="text-red-500 text-sm text-error">
                        {{ $t('error.user.lastName') }}
                      </p>
                    </template>
                </UFormField>
            </div>
            <div class="mb-6">
                <UFormField 
                    :label="$t('register.email')" 
                    name="email" 
                    required 
                    class="content_email text-xs font-medium text-gray-700 content_label"
                >
                  <UInput 
                    :avatar="{
                      src: '/images/svg/icon_email.svg'
                    }"
                    size="lg" 
                    v-model="userStore.email"
                    :placeholder="$t('register.email')"
                    :class="classInput()" 
                    class="text-sm font-regular"
                    @blur="handleEmail"
                  />
                    <template #error="{ error }">
                     <p v-if="error" class="text-red-500 text-sm text-error">
                      <!-- Vérifie le type de l'erreur pour afficher la traduction correcte -->
                      {{ error.includes('required') 
                         ? $t('error.user.emailRequired') 
                         : $t('error.user.email') }}
                    </p>
                    </template>
                </UFormField>
            </div>
            <div class="flex flex-col">
                <UButton 
                    type="submit" 
                    class="btn-primary w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl justify-center cursor-pointer"
                    :label="$t('common.continue')"
                />
            </div>
        </UForm>
    </div>
</template>
<script setup lang="ts">
import { userSchema, UserState, useUserStore } from '@/store/user';
import { useWorkspaceStore } from '@/store/workspace';
import { useOnboardingStore } from '@/store/onboarding';
const { locale, t } = useI18n();
const userStore = useUserStore();
const onboardingStore = useOnboardingStore();
const workspaceStore = useWorkspaceStore();
const emit = defineEmits(['update-avatar'])
const fileInput = ref(null);
const error = ref('');
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

// Appelée UNIQUEMENT si la validation Zod réussit
const handleStep1Submit = (event: { data: UserState }) => {
    console.log('Step 1 validé.', event.data);
    onboardingStore.nextStep();
}

const textPhoto = computed(() => {
    return userStore.avatarUrl ?
        t('register.editPhoto') :
        t('register.addPhoto');
});

const classInput = () => {
    return 'w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150'
}

const classLabel = () => {
    return 'block text-sm font-medium text-gray-700 mb-2'
}
const userName = computed(() => {
  const first = userStore.firstName?.trim() || "";
  const last = userStore.lastName?.trim() || "";

  const firstFormatted =
    first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();

  const lastFormatted =
    last.charAt(0).toUpperCase() + last.slice(1).toLowerCase();

  return `${firstFormatted} ${lastFormatted}`;
});

const triggerUpload = () => {
  error.value = ''
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type de fichier
  if (!ALLOWED_TYPES.includes(file.type)) {
    error.value = t('error.step.format');
    return
  }

  // Vérifier la taille
  if (file.size > MAX_SIZE) {
    error.value = t('error.step.size');
    return
  }

  // Pas d'erreur → lecture du fichier
  const reader = new FileReader()
  reader.onload = (e) => {
    userStore.setAvatar(e.target.result)
    error.value = '' // reset erreur
  }
  reader.readAsDataURL(file)
}

const deletePhoto = () => {
  userStore.deleteAvatar()
  error.value = ''
}
const uploadAvatar = (newAvatar) => {
  userStore.avatarUrl = newAvatar
  emit('update-avatar', newAvatar) // informe le parent
}

const handleEmail = async () => {
  if (userStore.email) {
    await workspaceStore.prefillFromEmail(userStore.email);
  }
};
</script>
<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

.bloc_photo {
    background-color: rgb(242, 244, 247);
}

.borde_white {
    border-color: #FFF;
}

:deep(.form_step_one .content_email input) {
    padding-left: 38px;
}

:deep(.form_step_one .content_email span.absolute) {
    padding-left: 10px;
}

:deep(.form_step_one .content_email span.absolute img) {
    opacity: 0.4;
    width: auto;
    height: auto;
}

:deep(.form_step_one .content_label label.block) {
    margin-bottom: 8px;
}

:deep(.content_button .iconify) {
    margin-right: 5px;
}

</style>