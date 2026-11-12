import { useEffect, useRef, useState } from 'react'
import { experience, type JourneyIcon, type Lang, type UI } from '../content.ts'
import { journeyDetails, type ArchPart, type FlightStage, type JourneyStat, type StatIcon } from '../journey.ts'
import {
  AltitudeIcon,
  AntennaIcon,
  ArrowIcon,
  BalloonIcon,
  BoltIcon,
  CartIcon,
  ChipIcon,
  GraduationIcon,
  GrowthIcon,
  IoTIcon,
  MoneyIcon,
  RocketIcon,
  StockIcon,
  TargetIcon,
  TrophyIcon,
  WaveIcon,
} from './Icons.tsx'
import iotGif from '../assets/journey-icons/iot.gif'
import iotPng from '../assets/journey-icons/iot.png'
import rocketGif from '../assets/journey-icons/rocket.gif'
import rocketPng from '../assets/journey-icons/rocket.png'
import cartGif from '../assets/journey-icons/cart.gif'
import cartPng from '../assets/journey-icons/cart.png'
import chipGif from '../assets/journey-icons/chip.gif'
import chipPng from '../assets/journey-icons/chip.png'
import Carousel from './Carousel.tsx'
import Checkpoints from './Checkpoints.tsx'
import FlightChart from './FlightChart.tsx'
import ArchFlow from './ArchFlow.tsx'

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

const HERO_GIFS: Record<JourneyIcon, { gif: string; still: string }> = {
  iot: { gif: iotGif, still: iotPng },
  rocket: { gif: rocketGif, still: rocketPng },
  cart: { gif: cartGif, still: cartPng },
  chip: { gif: chipGif, still: chipPng },
}

const JOURNEY_ICONS: Record<JourneyIcon, typeof RocketIcon> = {
  iot: IoTIcon,
  rocket: RocketIcon,
  cart: CartIcon,
  chip: ChipIcon,
}

const STAT_ICONS: Record<StatIcon, typeof RocketIcon> = {
  antenna: AntennaIcon,
  graduation: GraduationIcon,
  wave: WaveIcon,
  rocket: RocketIcon,
  altitude: AltitudeIcon,
  target: TargetIcon,
  trophy: TrophyIcon,
  growth: GrowthIcon,
  bolt: BoltIcon,
  money: MoneyIcon,
  stock: StockIcon,
  chip: ChipIcon,
  balloon: BalloonIcon,
}

function PagerIcon({ icon }: { icon: JourneyIcon }) {
  const Icon = JOURNEY_ICONS[icon]
  return (
    <span className="pager-icon" aria-hidden="true">
      <Icon size={20} />
    </span>
  )
}

export default function JourneyPage({
  slug,
  section,
  t,
  lang,
}: {
  slug: string
  section: string | null
  t: UI
  lang: Lang
}) {
  const index = experience.findIndex((e) => e.slug === slug)
  const exp = experience[index]
  const detail = journeyDetails[slug]

  const [stage, setStage] = useState<FlightStage | null>(null)
  const chart = useRef<HTMLDivElement>(null)
  useEffect(() => setStage(null), [slug])

  const [part, setPart] = useState<ArchPart>('overview')
  const arch = useRef<HTMLDivElement>(null)
  useEffect(() => setPart('overview'), [slug])

  const [flash, setFlash] = useState<number | null>(null)
  const flashTimer = useRef(0)
  useEffect(() => () => window.clearTimeout(flashTimer.current), [])
  const showCheckpoint = (i: number) => {
    document.getElementById(`checkpoint-${i}`)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
    window.clearTimeout(flashTimer.current)
    setFlash(null)
    requestAnimationFrame(() => setFlash(i))
    flashTimer.current = window.setTimeout(() => setFlash(null), 1800)
  }

  useEffect(() => {
    if (!section || !detail) return
    const i = detail.sections.filter((s) => s.timeline !== false).findIndex((s) => s.anchor === section)
    if (i < 0) return
    const id = window.setTimeout(() => showCheckpoint(i), 150)
    return () => window.clearTimeout(id)
  }, [slug, section])

  if (!exp || !detail) {
    return (
      <section className="section">
        <div className="container journey-page">
          <h1 className="section-title">{t.journeyNotFound}</h1>
          <a className="btn btn-ghost" href="#experience">← {t.journeyBack}</a>
        </div>
      </section>
    )
  }

  const hero = HERO_GIFS[exp.icon]
  const prev = experience[index - 1]
  const next = experience[index + 1]
  const carouselLabels = { prev: t.photosPrev, next: t.photosNext, open: t.photoOpen, close: t.closeImage }
  const timeline = detail.sections.filter((s) => s.timeline !== false)
  const extras = detail.sections.filter((s) => s.timeline === false)
  const hasChart = !!detail.flightChart
  const hasArch = !!detail.architecture
  const checkpointOf = (title: string) => timeline.findIndex((s) => s.title.en === title)
  const atlas = checkpointOf('Atlas, 3 km rocket (LASC 2026)')

  const statAction = (s: JourneyStat): (() => void) | null => {
    if (hasChart && s.flight) {
      const target = s.flight
      return () => {
        setStage((cur) => (cur === target ? null : target))
        chart.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' })
      }
    }
    if (hasArch && s.part) {
      const target = s.part
      return () => {
        setPart((cur) => (cur === target ? 'overview' : target))
        arch.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' })
      }
    }
    const i = s.section ? checkpointOf(s.section) : -1
    return i >= 0 ? () => showCheckpoint(i) : null
  }

  return (
    <article className="journey-page">
      <header className="journey-hero">
        <div className="container">
          <a className="back-link" href="#experience">← {t.journeyBack}</a>
          <div className="journey-hero-head">
            <picture className="journey-hero-icon" aria-hidden="true">
              <source srcSet={hero.still} media="(prefers-reduced-motion: reduce)" />
              <img src={hero.gif} alt="" width={56} height={56} />
            </picture>
            <div>
              <p className="eyebrow">
                {exp.unit} · {exp.period[lang]}
              </p>
              <h1 className="journey-hero-title">{exp.org[lang]}</h1>
              <p className="journey-hero-role">{exp.role[lang]}</p>
            </div>
          </div>
          <p className="journey-hero-intro">{detail.intro[lang]}</p>

          <ul className="journey-stats">
            {detail.stats.map((s) => {
              const StatIconC = STAT_ICONS[s.icon]
              const value = typeof s.value === 'string' ? s.value : s.value[lang]
              const body = (
                <>
                  <span className="journey-stat-text">
                    <span className="journey-stat-value">{value}</span>
                    <span className="journey-stat-label">{s.label[lang]}</span>
                  </span>
                  <span className="journey-stat-icon" aria-hidden="true">
                    <StatIconC size={22} />
                  </span>
                </>
              )
              const action = statAction(s)
              if (!action) {
                return (
                  <li key={s.label.en}>
                    <div className="journey-stat">{body}</div>
                  </li>
                )
              }
              const toFlight = hasChart && !!s.flight
              const toArch = hasArch && !!s.part
              const on = (toFlight && stage === s.flight) || (toArch && part === s.part)
              const controls = toFlight ? 'flight-stage' : toArch ? 'arch-info' : undefined
              const hint = toFlight ? t.statSeeFlight : toArch ? t.statSeeArch : t.statSeeCheckpoint
              return (
                <li key={s.label.en}>
                  <button
                    type="button"
                    className={`journey-stat is-action ${on ? 'is-on' : ''}`}
                    onClick={action}
                    aria-pressed={controls ? on : undefined}
                    aria-controls={controls}
                    aria-label={`${value} ${s.label[lang]}: ${hint}`}
                  >
                    {body}
                  </button>
                </li>
              )
            })}
          </ul>

          {hasChart && (
            <div ref={chart} className="flight-wrap">
              <FlightChart
                t={t}
                lang={lang}
                stage={stage ?? 'flight'}
                onStage={(s) => setStage(s)}
                onSeeAtlas={() => atlas >= 0 && showCheckpoint(atlas)}
              />
            </div>
          )}

          {hasArch && (
            <div ref={arch} className="flight-wrap">
              <ArchFlow t={t} lang={lang} part={part} onPart={setPart} />
            </div>
          )}
        </div>
      </header>

      <div className="container journey-body">
        <Checkpoints sections={timeline} t={t} lang={lang} carouselLabels={carouselLabels} flash={flash} />

        <div className="journey-extras">
          {extras.map((s) => (
            <section key={s.title.en} className="card journey-extra">
              <h2>{s.title[lang]}</h2>
              <p>{s.body[lang]}</p>
              {s.images && s.images.length > 0 && <Carousel images={s.images} lang={lang} labels={carouselLabels} />}
            </section>
          ))}
          <section className="card journey-extra">
            <h2>{t.journeyStack}</h2>
            <ul className="tags">
              {detail.stack.map((s) => (
                <li key={s} className="tag">{s}</li>
              ))}
            </ul>
            {detail.link && (
              <a className="project-link journey-repo" href={detail.link.href} target="_blank" rel="noreferrer">
                {detail.link.label[lang]} <ArrowIcon />
              </a>
            )}
          </section>
        </div>

        <nav className="journey-pager" aria-label={t.journeyBack}>
          {prev ? (
            <a href={`#/journey/${prev.slug}`} className="card pager-link">
              <PagerIcon icon={prev.icon} />
              <span className="pager-text">
                <span className="muted small">← {t.journeyPrev}</span>
                <strong>{prev.org[lang]}</strong>
              </span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={`#/journey/${next.slug}`} className="card pager-link is-next">
              <span className="pager-text">
                <span className="muted small">{t.journeyNext} →</span>
                <strong>{next.org[lang]}</strong>
              </span>
              <PagerIcon icon={next.icon} />
            </a>
          ) : (
            <span />
          )}
        </nav>
      </div>

    </article>
  )
}
