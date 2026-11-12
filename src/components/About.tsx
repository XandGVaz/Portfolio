import { useEffect, useRef, useState } from 'react'
import { about, experience, type Lang, type UI } from '../content.ts'
import { ArrowIcon, ChevronIcon } from './Icons.tsx'
import SectionHeading from './SectionHeading.tsx'
import iotGif from '../assets/about/iot.gif'
import iotPng from '../assets/about/iot.png'
import rocketGif from '../assets/about/rocket.gif'
import rocketPng from '../assets/about/rocket.png'
import chipGif from '../assets/about/chip.gif'
import chipPng from '../assets/about/chip.png'
import sparklesGif from '../assets/about/sparkles.gif'
import sparklesPng from '../assets/about/sparkles.png'
import firmwareGif from '../assets/about/firmware.gif'
import firmwarePng from '../assets/about/firmware.png'
import webGif from '../assets/about/web.gif'
import webPng from '../assets/about/web.png'

const GIFS = {
  iot: { gif: iotGif, still: iotPng },
  rocket: { gif: rocketGif, still: rocketPng },
  chip: { gif: chipGif, still: chipPng },
  sparkles: { gif: sparklesGif, still: sparklesPng },
  firmware: { gif: firmwareGif, still: firmwarePng },
  web: { gif: webGif, still: webPng },
}

function AnimatedIcon({ name }: { name: keyof typeof GIFS }) {
  const { gif, still } = GIFS[name]
  return (
    <picture className="mini-gif" aria-hidden="true">
      <source srcSet={still} media="(prefers-reduced-motion: reduce)" />
      <img src={gif} alt="" width={22} height={22} />
    </picture>
  )
}

export default function About({ t, lang }: { t: UI; lang: Lang }) {
  const [groupsOpen, setGroupsOpen] = useState(false)
  const [mini, setMini] = useState<string | null>(null)
  const bar = useRef<HTMLDivElement>(null)
  const current = about.minis.find((m) => m.icon === mini)

  useEffect(() => {
    if (!mini) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMini(null)
    }
    const onDown = (e: MouseEvent) => {
      if (bar.current && !bar.current.contains(e.target as Node)) setMini(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [mini])

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading eyebrow={t.aboutEyebrow} title={t.aboutTitle} />

        <div className="card about-card">
          <div ref={bar}>
            <div className="window-bar">
              <span className="window-dots" aria-hidden="true">
                <i /> <i /> <i />
              </span>
              <span className="mono window-path">{t.aboutFile}</span>
              <ul className="window-tags">
                {about.minis.map((m) => {
                  const on = mini === m.icon
                  return (
                    <li key={m.icon}>
                      <button
                        type="button"
                        className={`${m.highlight ? 'about-tag' : 'about-chip'} ${on ? 'is-on' : ''}`}
                        aria-expanded={on}
                        aria-controls="mini-detail"
                        onClick={() => setMini(on ? null : m.icon)}
                      >
                        <AnimatedIcon name={m.icon} /> {m.label[lang]}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div id="mini-detail" className="mini-detail-slot" aria-live="polite">
              {current && (
                <div className="mini-detail" key={current.icon}>
                  <AnimatedIcon name={current.icon} />
                  <p>
                    <strong>{current.label[lang]}</strong> {current.detail[lang]}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="about-grid">
            <div>
              <h3 className="about-title">{about.title[lang]}</h3>
              {about.paragraphs[lang].map((p) => (
                <p key={p} className="about-text">{p}</p>
              ))}
            </div>

            <div className="about-background">
              {about.background.map((b) => {
                const body = (
                  <>
                    <div className="bg-card-top">
                      <span className="pill mono">{b.period[lang]}</span>
                      <span className="mono muted small">{b.place}</span>
                    </div>
                    <h4 className="bg-card-title">{b.title[lang]}</h4>
                    <p className="bg-card-subtitle">{b.subtitle[lang]}</p>
                    <p className="muted small">{b.note[lang]}</p>
                  </>
                )

                if (b.href) {
                  return (
                    <a key={b.title.en} className="bg-card is-link" href={b.href}>
                      {body}
                      <span className="project-link bg-card-more">
                        {t.aboutSeeJourney} <ArrowIcon />
                      </span>
                    </a>
                  )
                }

                const groups = (b.groups ?? [])
                  .map((slug) => experience.find((e) => e.slug === slug))
                  .filter((e) => e !== undefined)

                return (
                  <article key={b.title.en} className={`bg-card ${groupsOpen ? 'is-open' : ''}`}>
                    {body}
                    {groups.length > 0 && (
                      <>
                        <button
                          type="button"
                          className="bg-card-toggle"
                          aria-expanded={groupsOpen}
                          aria-controls="about-groups"
                          onClick={() => setGroupsOpen((o) => !o)}
                        >
                          {t.aboutGroups} <ChevronIcon />
                        </button>
                        <ul id="about-groups" className="bg-card-groups" hidden={!groupsOpen}>
                          {groups.map((e) => (
                            <li key={e.slug}>
                              <a href={`#/journey/${e.slug}`}>
                                <span>
                                  <strong>{e.org[lang]}</strong>
                                  <span className="muted small">{e.role[lang]}</span>
                                </span>
                                <ArrowIcon />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
