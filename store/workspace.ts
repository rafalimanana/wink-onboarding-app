import { defineStore } from 'pinia'
import { z } from 'zod'

// 1. Définition du SCHÉMA Zod
export const workspaceSchema = z.object({
  name: z.string().min(3, "Le nom de l'entreprise est requis et doit contenir au moins 3 caractères."),
  /*description: z.string().min(5, "La description est requise.").max(600, "La description ne doit pas dépasser 500 caractères.").optional().nullable(),
  website: z.string()
    .min(3, "Le site internet est requis.")
    .refine((val) => {
      try {
        // Préfixe https:// uniquement pour valider URL
        new URL(val.startsWith('http') ? val : `https://${val}`);
        return true;
      } catch {
        return false;
      }
    }, "URL de site internet invalide."),
  logoUrl: z.string().url("URL de logo invalide.").nullable(),
  address: z.string().min(5, "L'adresse du siège social est requise."),
  activitySector: z.string().min(2, "Le secteur d'activité est requis."),*/
})


// 2. Définition du TYPE TypeScript à partir du schéma
export type WorkspaceState = z.infer<typeof workspaceSchema>

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    name: '',
    description: '',
    website: '',
    logoUrl: null,
    address: '',
    activitySector: '',
  } as WorkspaceState),

  actions: {
    /**
     * Préremplit champs à partir d'un email
     */
    async prefillFromEmail(email: string) {
      if (!email.includes('@')) return;

      const domain = email.split('@')[1];
      const companyRaw = domain.split('.')[0];

      // Nom société formaté
      const companyName = companyRaw
        .split(/[-_]/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      this.name = companyName;
      this.website = domain; // juste le domaine, sans https://

      // Récupération Wikipedia
      const wikiInfo = await this.fetchCompanyInfoFromWikipedia(companyName);

      if (wikiInfo) {
        this.description = wikiInfo.description;
        this.activitySector = wikiInfo.sector;
      } else {
        this.description = `Entreprise spécialisée dans son domaine.`;
        this.activitySector = '';
      }
    },

    /**
     * Nettoie le site web si utilisateur tape http(s)://
     */
    cleanWebsiteInput(url: string) {
      return url.replace(/^https?:\/\//i, '');
    },

    /**
     * Fetch Wikipedia info et détection du secteur
     */
    async fetchCompanyInfoFromWikipedia(companyName: string): Promise<{description: string, sector?: string} | null> {
      try {
        const url = `https://fr.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(companyName)}`;
        const res = await fetch(url);
        const data = await res.json();

        const pages = data.query?.pages;
        if (!pages) return null;

        const page = Object.values(pages)[0] as any;
        if (!page || !page.extract) return null;

        const description = page.extract;
        const sector = this.detectSectorFromDescription(description);

        return { description, sector };
      } catch (error) {
        console.error("Erreur récupération Wikipedia :", error);
        return null;
      }
    },

    /**
     * Détecte le secteur à partir du texte
     */
    detectSectorFromDescription(description: string): string | undefined {
      const sectors: Record<string, string> = {
        auto: "Automobile",
        voiture: "Automobile",
        automobile: "Automobile",
        tech: "Technologie",
        digital: "Digital",
        banque: "Finance",
        finance: "Finance",
        restauration: "Restauration",
        hotel: "Hôtellerie",
        telecom: "Télécommunications",
        médias: "Médias",
        media: "Médias",
        énergie: "Énergie",
      };

      const plainText = description.toLowerCase();

      for (const keyword in sectors) {
        if (plainText.includes(keyword)) {
          return sectors[keyword];
        }
      }

      return '';
    }
  }
})