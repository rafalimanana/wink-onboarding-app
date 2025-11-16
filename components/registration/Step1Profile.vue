<template>
    <div class="animate-fade-in order-2 md:order-1">
        <UForm :schema="userSchema" :state="userStore" @submit="handleStep1Submit">
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{$t('register.profilePhoto')}}
                </label>
                <div class="flex items-center space-x-4">
                    <div class="bloc_photo w-18 h-18 rounded-full flex items-center justify-center text-gray font-semibold text-lg border-2 borde_white shadow-md overflow-hidden">
                        <!-- <div 
                            v-if="!userStore.firstName && !userStore.lastName && !userStore.avatarUrl"
                        >
                            <UAvatar 
                                icon="i-lucide-image" 
                                size="md" 
                                class="object-cover w-full h-full text-3xl font-semibold text-gray-700 mt-2"
                            />
                        </div>
                        <div v-else>
                            <UAvatar 
                                :src="userStore.avatarUrl" 
                                :alt="userName"
                                class="object-cover w-full h-full text-3xl font-semibold text-gray-700"
                            />
                        </div> -->
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
                              class="m-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
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
                                :class="!workspaceStore.avatarUrl ? 'cursor-not-allowed' : ''"
                                :disabled="!workspaceStore.avatarUrl" 
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
                <UFormField :label="$t('register.firstName')" name="firstName" required>
                    <UInput 
                        v-model="userStore.firstName" 
                        :class="classInput()" 
                        size="xl" 
                        :placeholder="$t('register.firstName')" 
                    />
                </UFormField>
            </div>
            <div class="mb-6">
                <UFormField :label="$t('register.lastName')" name="lastName" required>
                    <UInput 
                        v-model="userStore.lastName" 
                        :class="classInput()" 
                        :placeholder="$t('register.lastName')" 
                        size="xl" 
                    />
                </UFormField>
            </div>
            <div class="mb-6">
                <UFormField :label="$t('register.email')" name="email" required >
                    <UInput 
                        v-model="userStore.email" 
                        icon="i-heroicons-envelope"
                        :class="classInput()" 
                        class="pl-10 pr-4 bg-gray-50 cursor-not-allowed"
                        @blur="handleEmail"
                    />
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
    error.value = 'Seuls les formats PNG et JPEG sont acceptés.'
    return
  }

  // Vérifier la taille
  if (file.size > MAX_SIZE) {
    error.value = 'La taille du fichier ne doit pas dépasser 5 Mo.'
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
</style>