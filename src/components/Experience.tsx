import { useEffect, useRef, type ReactNode } from 'react'
import { experience, projects, type JourneyIcon, type Lang, type Project, type UI } from '../content.ts'
import {
  AntennaIcon,
  ArrowIcon,
  CartIcon,
  ChipIcon,
  CodeIcon,
  GrowthIcon,
  IoTIcon,
  RocketIcon,
  SpeedIcon,
  TargetIcon,
  TrophyIcon,
} from './Icons.tsx'
import SectionHeading from './SectionHeading.tsx'

const JOURNEY_ICONS: Record<JourneyIcon, typeof IoTIcon> = {
  iot: IoTIcon,
  rocket: RocketIcon,
  cart: CartIcon,
  chip: ChipIcon,
}

const PROJECT_ICONS = {
  trophy: TrophyIcon,
  target: TargetIcon,
  antenna: AntennaIcon,
  growth: GrowthIcon,
  speed: SpeedIcon,
}

const projectsOf = (slug: string): Project[] =>
  projects.filter((p) => p.journey === slug).sort((a, b) => Number(!!b.badge) - Number(!!a.badge))

function ProjectRow({ children }: { children: ReactNode }) {
  const row = useRef<HTMLUListElement>(null)
  useEffect(() => {
    const el = row.current
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      el.classList.toggle('fade-start', el.scrollLeft > 2)
      el.classList.toggle('fade-end', el.scrollLeft < max - 2)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])
  return <ul ref={row}>{children}</ul>
}

export default function ExperienceSection({ t, lang }: { t: UI; lang: Lang }) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = list.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('reveal')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible')
            io.unobserve(en.target)
          }
        }),
      { rootMargin: '0px 0px -10% 0px' },
    )
    el.querySelectorAll('.journey-item').forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [])

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading eyebrow={t.experienceEyebrow} title={t.experienceTitle} />

        <ol className="journey" ref={list}>
          {experience.map((e, i) => {
            const Icon = JOURNEY_ICONS[e.icon]
            const related = projectsOf(e.slug)
            return (
              <li key={e.org.en} className={`journey-item ${i % 2 === 0 ? 'is-left' : 'is-right'}`}>
                <span className="journey-node" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div className="card journey-card">
                  <div className="journey-top">
                    <span className="pill mono">{e.period[lang]}</span>
                    <span className="mono muted small">{e.unit}</span>
                  </div>
                  {related.length > 0 && (
                    <div className="journey-projects">
                      <ProjectRow>
                        {related.map((p) => {
                          const PIcon = p.badge ? PROJECT_ICONS[p.badge.icon] : CodeIcon
                          return (
                            <li key={p.id}>
                              <a
                                className="journey-project"
                                href={`#project-${p.id}`}
                                aria-label={`${t.journeyProjectOpen}: ${p.title[lang]}`}
                                title={p.title[lang]}
                              >
                                <PIcon size={15} />
                                {p.short[lang]}
                              </a>
                            </li>
                          )
                        })}
                      </ProjectRow>
                    </div>
                  )}
                  <h3 className="journey-org">{e.org[lang]}</h3>
                  <p className="journey-role">{e.role[lang]}</p>
                  <ul className="journey-points">
                    {e.points[lang].map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <a
                    className="project-link journey-more"
                    href={`#/journey/${e.slug}`}
                    aria-label={`${t.journeyMore}: ${e.org[lang]}`}
                  >
                    {t.journeyMore} <ArrowIcon />
                  </a>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
