import { profile, type UI } from '../content.ts'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.tsx'

export default function Hero({ t }: { t: UI }) {
  return (
    <section id="top" className="hero">
      <div className="container">
        <p className="eyebrow">{t.role}</p>
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-headline">{t.headline}</p>
        <p className="hero-summary">{t.summary}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">{t.ctaProjects}</a>
          <a className="btn btn-ghost" href="#contact">{t.ctaContact}</a>
        </div>
        <div className="hero-links">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon size={20} /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon size={20} /></a>
          <a href={`mailto:${profile.email}`} aria-label="E-mail"><MailIcon size={20} /></a>
        </div>
      </div>
    </section>
  )
}
