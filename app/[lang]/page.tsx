import Image from "next/image";
import { notFound } from "next/navigation";
import { DomainName } from "./ui/domain-name";
import { LanguageSelector } from "./ui/language-selector";
import { ThemeSelector } from "./ui/theme-selector";
import { TriangleAnimation } from "./ui/triangle-animation";
import { copy, hasLocale } from "./translations";

const Arrow = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const t = copy[lang];
  const trainventUrl = `https://next.trainvent.com/${lang}/`;
  const contactUrl = `https://next.trainvent.com/${lang}/contact/`;

  return (
    <div className="site-shell">
      <header className="topbar wrap">
        <a className="brand" href={trainventUrl} target="_blank" rel="noreferrer">
          <Image
            src="/Trainvent_Logo.svg"
            alt=""
            width={38}
            height={38}
            priority
          />
          <span>Trainvent</span>
        </a>
        <div className="topbar-actions">
          <ThemeSelector labels={t.nav} />
          <LanguageSelector lang={lang} labels={t.nav} />
        </div>
      </header>

      <main>
        <section className="hero wrap">
          <div>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>
              {t.hero.titleStart} <em>{t.hero.titleEmphasis}</em>
            </h1>
            <p className="hero-copy">{t.hero.text}</p>
            <div className="domain-chip" aria-label={t.hero.domainStatus}>
              <span className="domain-dot" />
              <DomainName /> · {t.hero.domainStatus}
            </div>
            <div className="actions">
              <a className="button button-primary" href={trainventUrl} target="_blank" rel="noreferrer">
                {t.hero.company}
                <Arrow />
              </a>
              <a className="button button-secondary" href={contactUrl} target="_blank" rel="noreferrer">
                {t.hero.contact}
              </a>
            </div>
          </div>

          <div className="animation-wrap">
            <TriangleAnimation />
            <span className="animation-label">{t.hero.artLabel}</span>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} Trainvent · {t.footer.note}</span>
        <div className="footer-links">
          <a href="mailto:info@trainvent.com">info@trainvent.com</a>
          <a href={`https://next.trainvent.com/${lang}/imprint/`} target="_blank" rel="noreferrer">
            {t.footer.imprint}
          </a>
          <a href={`https://next.trainvent.com/${lang}/software-support/`} target="_blank" rel="noreferrer">
            {t.footer.support}
          </a>
        </div>
      </footer>
    </div>
  );
}
