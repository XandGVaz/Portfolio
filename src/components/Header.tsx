import type { Lang, UI } from '../content.ts'
import { MoonIcon, SunIcon } from './Icons.tsx'

interface Props {
  t: UI
  lang: Lang
  theme: 'light' | 'dark'
  onToggleLang: () => void
  onToggleTheme: () => void
}

export default function Header({ t, lang, theme, onToggleLang, onToggleTheme }: Props) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">VV</span>
          <span className="brand-name">Vitor Vaz</span>
        </a>
        <nav className="nav" aria-label="Principal">
          <a href="#projects">{t.nav.projects}</a>
          <a href="#experience">{t.nav.experience}</a>
          <a href="#skills">{t.nav.skills}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn lang-btn" onClick={onToggleLang} title={t.langToggle} aria-label={t.langToggle}>
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          <button className="icon-btn" onClick={onToggleTheme} title={t.themeToggle} aria-label={t.themeToggle}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
