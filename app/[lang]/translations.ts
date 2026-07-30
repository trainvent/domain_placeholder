export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export const hasLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const copy = {
  en: {
    langName: "English",
    nav: {
      system: "System language",
      english: "English",
      german: "Deutsch",
      theme: "Color mode",
      dark: "Dark",
      light: "Light",
    },
    hero: {
      eyebrow: "A quiet corner of the internet",
      titleStart: "This domain is taking a short",
      titleEmphasis: "creative break.",
      text: "It belongs to Trainvent. There is nothing to launch here yet—but ideas tend to arrive before websites do.",
      domainStatus: "Held with purpose",
      company: "Meet Trainvent",
      contact: "Get in touch",
      artLabel: "LEONMARQ",
    },
    footer: {
      note: "A domain cared for by Trainvent.",
      imprint: "Imprint",
      support: "Software support",
    },
  },
  de: {
    langName: "Deutsch",
    nav: {
      system: "Systemsprache",
      english: "English",
      german: "Deutsch",
      theme: "Farbmodus",
      dark: "Dunkel",
      light: "Hell",
    },
    hero: {
      eyebrow: "Eine ruhige Ecke des Internets",
      titleStart: "Diese Domain macht eine kurze",
      titleEmphasis: "kreative Pause.",
      text: "Sie gehört zu Trainvent. Noch gibt es hier nichts zu starten – aber Ideen sind oft vor ihren Websites da.",
      domainStatus: "Bewusst reserviert",
      company: "Trainvent entdecken",
      contact: "Kontakt aufnehmen",
      artLabel: "LEONMARQ",
    },
    footer: {
      note: "Eine Domain in der Obhut von Trainvent.",
      imprint: "Impressum",
      support: "Software-Support",
    },
  },
} as const;
