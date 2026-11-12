import { profile, type Lang, type UI } from '../content.ts'
import photo from '../assets/vitor.webp'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.tsx'
import ResumeMenu from './ResumeMenu.tsx'
import pipelinePtGif from '../assets/about/pipeline-pt.gif'
import pipelinePtPng from '../assets/about/pipeline-pt.png'
import pipelinePtSmGif from '../assets/about/pipeline-pt-sm.gif'
import pipelinePtSmPng from '../assets/about/pipeline-pt-sm.png'
import pipelineEnGif from '../assets/about/pipeline-en.gif'
import pipelineEnPng from '../assets/about/pipeline-en.png'
import pipelineEnSmGif from '../assets/about/pipeline-en-sm.gif'
import pipelineEnSmPng from '../assets/about/pipeline-en-sm.png'

const PIPELINE = {
  pt: { gif: pipelinePtGif, still: pipelinePtPng, smGif: pipelinePtSmGif, smStill: pipelinePtSmPng },
  en: { gif: pipelineEnGif, still: pipelineEnPng, smGif: pipelineEnSmGif, smStill: pipelineEnSmPng },
}
const SMALL = '(max-width: 560px)'
const STILL = '(prefers-reduced-motion: reduce)'

function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  )
}

export default function Hero({ t, lang }: { t: UI; lang: Lang }) {
  return (
    <section id="top" className="hero">
      <div className="container container-hero hero-grid">
        <figure className="card hero-card">
          <div className="window-bar">
            <span className="window-dots" aria-hidden="true">
              <i /> <i /> <i />
            </span>
            <span className="mono window-path">{t.heroFile}</span>
          </div>
          <div className="hero-card-body">
            <div className="hero-card-head">
              <div className="hero-photo">
                <img src={photo} alt={profile.name} width={280} height={280} />
              </div>
              <figcaption className="hero-tagline">{t.tagline}</figcaption>
            </div>
          </div>
          <picture className="hero-terminal">
            <source srcSet={PIPELINE[lang].smStill} media={`${STILL} and ${SMALL}`} width={600} height={462} />
            <source srcSet={PIPELINE[lang].still} media={STILL} width={1000} height={520} />
            <source srcSet={PIPELINE[lang].smGif} media={SMALL} width={600} height={462} />
            <img src={PIPELINE[lang].gif} alt={t.pipelineAlt} width={1000} height={520} />
          </picture>
        </figure>
        <div className="hero-text">
          <p className="eyebrow">{t.role}</p>
          <h1 className="hero-name">
            <span>Vitor Alexandre</span> <span>Garcia Vaz</span>
          </h1>
          <p className="hero-headline">
            {t.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="hero-summary">
            <Emphasis text={t.summary} />
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">{t.ctaProjects}</a>
            <ResumeMenu t={t} lang={lang} />
            <a className="btn btn-ghost" href="#contact">{t.ctaContact}</a>
          </div>
          <div className="hero-links">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon size={20} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon size={20} /></a>
            <a href={`mailto:${profile.email}`} aria-label="E-mail"><MailIcon size={20} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
