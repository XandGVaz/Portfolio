import { useEffect, useState } from 'react'
import { projects, type Area, type Lang, type Project, type UI } from '../content.ts'
import SectionHeading from './SectionHeading.tsx'
import { AntennaIcon, ArrowIcon, GrowthIcon, LockIcon, SpeedIcon, TargetIcon, TrophyIcon } from './Icons.tsx'

const BADGE_ICONS = {
  trophy: TrophyIcon,
  target: TargetIcon,
  antenna: AntennaIcon,
  growth: GrowthIcon,
  speed: SpeedIcon,
}

function BadgeIcon({ icon }: { icon: NonNullable<Project['badge']>['icon'] }) {
  const Icon = BADGE_ICONS[icon]
  return <Icon />
}

type Filter = 'all' | Area
const FILTERS: Filter[] = ['all', 'embedded', 'backend', 'iot']

function ProjectCard({ p, t, lang, flash }: { p: Project; t: UI; lang: Lang; flash: boolean }) {
  return (
    <article id={`project-${p.id}`} className={`card project ${p.badge ? 'is-awarded' : ''} ${flash ? 'is-flash' : ''}`}>
      <div className="project-meta">
        <span>{p.context}</span>
        <span className="mono">{p.period}</span>
      </div>
      <h3 className="project-title">{p.title[lang]}</h3>
      <p className="project-summary">{p.summary[lang]}</p>

      {p.badge && (
        <div className="award">
          <BadgeIcon icon={p.badge.icon} />
          <div>
            <span className="award-title">{p.badge.title[lang]}</span>
            <span className="award-detail">{p.badge.detail[lang]}</span>
          </div>
        </div>
      )}

      <ul className="project-points">
        {p.highlights[lang].map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className="project-footer">
        <ul className="tags" aria-label="Stack">
          {p.stack.map((s) => (
            <li key={s} className="tag">{s}</li>
          ))}
        </ul>
        {p.repo ? (
          <a className="project-link" href={p.repo} target="_blank" rel="noreferrer">
            {t.viewCode} <ArrowIcon />
          </a>
        ) : (
          <span className="project-private"><LockIcon /> {t.privateCode}</span>
        )}
      </div>
    </article>
  )
}

// Projetos com selo (métrica/prêmio) primeiro; o sort é estável, então
// dentro de cada grupo vale a ordem definida em content.ts.
const ordered = [...projects].sort((a, b) => Number(!!b.badge) - Number(!!a.badge))

export default function Projects({ t, lang }: { t: UI; lang: Lang }) {
  const [filter, setFilter] = useState<Filter>('all')

  const [flash, setFlash] = useState<string | null>(null)

  // Um link para um projeto (#project-<id>, ex.: vindo de Tecnologias) mostra
  // todos os projetos, para o card de destino não estar escondido pelo filtro,
  // e faz o card piscar em destaque.
  useEffect(() => {
    let timer = 0
    const onHash = () => {
      // #projects/<filtro> (ex.: #projects/iot): abre a seção já filtrada
      const f = window.location.hash.match(/^#projects\/(all|embedded|backend|iot)$/)
      if (f) {
        setFilter(f[1] as Filter)
        return
      }
      const m = window.location.hash.match(/^#project-([\w-]+)$/)
      if (!m) return
      setFilter('all')
      setFlash(m[1])
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setFlash(null), 1700)
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.clearTimeout(timer)
    }
  }, [])
  const visible = filter === 'all' ? ordered : ordered.filter((p) => p.areas.includes(filter))

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading eyebrow={t.projectsEyebrow} title={t.projectsTitle} lead={t.projectsLead} />

        <div className="filters" role="group" aria-label="Filtro">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? 'is-active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {t.filters[f]}
            </button>
          ))}
        </div>

        <div className="project-grid">
          {visible.map((p) => (
            <ProjectCard key={p.id} p={p} t={t} lang={lang} flash={flash === p.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
