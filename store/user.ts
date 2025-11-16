import { defineStore } from 'pinia'
import { z } from 'zod'

// 1. Définition du SCHÉMA Zod
export const userSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis et doit contenir au moins 2 caractères."),
  lastName: z.string().min(2, "Le nom est requis et doit contenir au moins 2 caractères."),
  email: z.string().email("Format d'adresse mail invalide.").min(5, "L'adresse mail est requise."),
  avatarUrl: z.string().url("URL d'avatar invalide.").nullable(),
})

// 2. Définition du TYPE TypeScript à partir du schéma
export type UserState = z.infer<typeof userSchema>

export const useUserStore = defineStore('user', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: null,
  } as UserState),

  actions: {
    updateAvatar(url: string) {
      this.avatarUrl = url
    },
    setAvatar(url) {
      this.avatarUrl = url
    },
    deleteAvatar() {
      this.avatarUrl = null
    },
  }
})