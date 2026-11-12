import { useEffect, useState } from 'react'
import { ui, type Lang } from './content.ts'
import { load, save } from './storage.ts'
import Header from './components/Header.tsx'
import Hero from './components/Hero.tsx'
import About from './components/About.tsx'
import Projects from './components/Projects.tsx'
import ExperienceSection from './components/Experience.tsx'
import Awards from './components/Awards.tsx'
import Skills from './components/Skills.tsx'
import Contact from './components/Contact.tsx'
import JourneyPage from './components/JourneyPage.tsx'
import { useHashRoute } from './useHashRoute.ts'

type Theme = 'light' | 'dark'

function initialLang(): Lang {
  const saved = load('lang')
  if (saved === 'pt' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

function initialTheme(): Theme {
  const saved = load('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const t = ui[lang]
  const route = useHashRoute()

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleLang = () => {
    const next: Lang = lang === 'pt' ? 'en' : 'pt'
    setLang(next)
    save('lang', next)
  }

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    save('theme', next)
  }

  return (
    <>
      <Header t={t} lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />
      <main>
        {route.page === 'journey' ? (
          <JourneyPage slug={route.slug} section={route.section} t={t} lang={lang} />
        ) : (
          <>
            <Hero t={t} lang={lang} />
            <About t={t} lang={lang} />
            <ExperienceSection t={t} lang={lang} />
            <Awards t={t} lang={lang} />
            <Projects t={t} lang={lang} />
            <Skills t={t} lang={lang} />
            <Contact t={t} lang={lang} />
          </>
        )}
      </main>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} Vitor Alexandre Garcia Vaz · {t.footer}
        </div>
      </footer>
    </>
  )
}
