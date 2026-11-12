import { profile, type Lang, type UI } from '../content.ts'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.tsx'
import ResumeMenu from './ResumeMenu.tsx'

export default function Contact({ t, lang }: { t: UI; lang: Lang }) {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="card contact">
          <h2 className="section-title">{t.contactTitle}</h2>
          <p className="section-lead">{t.contactLead}</p>
          <div className="contact-links">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              <MailIcon /> {profile.email}
            </a>
            <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
            <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
              <GitHubIcon /> GitHub
            </a>
            <ResumeMenu t={t} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  )
}
