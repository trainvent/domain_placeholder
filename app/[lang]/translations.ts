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
    },
    hero: {
      eyebrow: "A quiet corner of the internet",
      titleStart: "This domain is taking a short",
      titleEmphasis: "creative break.",
      text: "It belongs to Trainvent. There is nothing to launch here yet—but ideas tend to arrive before websites do.",
      domainStatus: "Held with purpose",
      company: "Meet Trainvent",
      contact: "Get in touch",
      artLabel: "LM",
    },
    reserved: {
      kicker: "Why you landed here",
      titleStart: "Not an empty page.",
      titleEmphasis: "A reserved possibility.",
      cards: [
        {
          title: "A deliberate pause",
          text: "This address is part of Trainvent’s domain collection and is not currently assigned to a public project.",
        },
        {
          title: "Ideas need room",
          text: "Good product names often arrive early. We keep the right address ready while the idea behind it takes shape.",
        },
        {
          title: "Built when useful",
          text: "Trainvent turns practical ideas into digital systems, automation and working products—one thoughtful step at a time.",
        },
      ],
    },
    story: {
      kicker: "What happens next",
      titleStart: "A name can become",
      titleEmphasis: "almost anything.",
      text: "For now, this domain is simply being looked after. If a useful idea finds its way here, it may become something more.",
      steps: [
        {
          title: "Reserved today",
          text: "The domain stays secure, maintained and connected to Trainvent.",
        },
        {
          title: "A concept tomorrow",
          text: "Experiments, useful tools and product ideas get the space to develop without pressure.",
        },
        {
          title: "A useful thing, eventually",
          text: "If the right concept appears, this quiet page can turn into a real destination.",
        },
      ],
    },
    cta: {
      titleStart: "Curious about",
      titleEmphasis: "Trainvent?",
      text: "Discover the company, its projects and practical digital work—or send a message if you have something in mind.",
      company: "Visit Trainvent",
      contact: "Contact us",
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
    },
    hero: {
      eyebrow: "Eine ruhige Ecke des Internets",
      titleStart: "Diese Domain macht eine",
      titleEmphasis: "kreative Pause.",
      text: "Sie gehört zu Trainvent. Noch gibt es hier nichts zu starten – aber Ideen sind oft vor ihren Websites da.",
      domainStatus: "Bewusst reserviert",
      company: "Trainvent entdecken",
      contact: "Kontakt aufnehmen",
      artLabel: "LM",
    },
    reserved: {
      kicker: "Warum du hier gelandet bist",
      titleStart: "Keine leere Seite.",
      titleEmphasis: "Eine reservierte Möglichkeit.",
      cards: [
        {
          title: "Eine bewusste Pause",
          text: "Diese Adresse gehört zur Domainsammlung von Trainvent und ist derzeit keinem öffentlichen Projekt zugeordnet.",
        },
        {
          title: "Ideen brauchen Raum",
          text: "Gute Produktnamen entstehen oft früh. Wir halten die passende Adresse bereit, während die Idee dahinter Form annimmt.",
        },
        {
          title: "Gebaut, wenn es nützt",
          text: "Trainvent macht aus praktischen Ideen digitale Systeme, Automatisierungen und funktionierende Produkte – Schritt für Schritt.",
        },
      ],
    },
    story: {
      kicker: "Wie es weitergeht",
      titleStart: "Ein Name kann",
      titleEmphasis: "fast alles werden.",
      text: "Im Moment wird diese Domain einfach gut aufgehoben. Wenn eine nützliche Idee ihren Weg hierherfindet, kann mehr daraus werden.",
      steps: [
        {
          title: "Heute reserviert",
          text: "Die Domain bleibt sicher, gepflegt und mit Trainvent verbunden.",
        },
        {
          title: "Morgen ein Konzept",
          text: "Experimente, nützliche Werkzeuge und Produktideen bekommen Raum, sich ohne Druck zu entwickeln.",
        },
        {
          title: "Irgendwann etwas Nützliches",
          text: "Wenn das richtige Konzept auftaucht, kann aus dieser ruhigen Seite ein echtes Ziel werden.",
        },
      ],
    },
    cta: {
      titleStart: "Neugierig auf",
      titleEmphasis: "Trainvent?",
      text: "Entdecke das Unternehmen, seine Projekte und praktische digitale Arbeit – oder schreib uns, wenn du etwas im Sinn hast.",
      company: "Trainvent besuchen",
      contact: "Kontakt aufnehmen",
    },
    footer: {
      note: "Eine Domain in der Obhut von Trainvent.",
      imprint: "Impressum",
      support: "Software-Support",
    },
  },
} as const;
