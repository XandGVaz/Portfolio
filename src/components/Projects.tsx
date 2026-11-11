import { useState } from 'react'
import { projects, type Area, type Lang, type Project, type UI } from '../content.ts'
import { ArrowIcon, LockIcon } from './Icons.tsx'

type Filter = 'all' | Area
const FILTERS: Filter[] = ['all', 'embedded', 'backend', 'iot']

function ProjectCard({ p, t, lang }: { p: Project; t: UI; lang: Lang }) {
  return (
    <article className="card project">
      <div className="project-meta">
        <span>{p.context}</span>
        <span className="mono">{p.period}</span>
      </div>
      <h3 className="project-title">{p.title[lang]}</h3>
      <p className="project-summary">{p.summary[lang]}</p>

      {p.metric && (
        <div className="metric">
          <span className="metric-value">{p.metric.value}</span>
          <span className="metric-label">{p.metric.label[lang]}</span>
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

export default function Projects({ t, lang }: { t: UI; lang: Lang }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? projects : projects.filter((p) => p.areas.includes(filter))

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">{t.projectsTitle}</h2>
        <p className="section-lead">{t.projectsLead}</p>

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
            <ProjectCard key={p.id} p={p} t={t} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
