import { awards, type Award, type Lang, type UI } from '../content.ts'
import { ArrowIcon, TrophyIcon } from './Icons.tsx'
import SectionHeading from './SectionHeading.tsx'
import satelliteGif from '../assets/about/satellite.gif'
import satellitePng from '../assets/about/satellite.png'
import sparklesGif from '../assets/about/sparkles.gif'
import sparklesPng from '../assets/about/sparkles.png'

const ICONS: Record<Award['icon'], { gif: string; still: string }> = {
  paper: { gif: sparklesGif, still: sparklesPng },
  satellite: { gif: satelliteGif, still: satellitePng },
}

export default function Awards({ t, lang }: { t: UI; lang: Lang }) {
  return (
    <section id="awards" className="section">
      <div className="container">
        <SectionHeading eyebrow={t.awardsEyebrow} title={t.awardsTitle} lead={t.awardsLead} />

        <ul className="award-grid">
          {awards.map((a) => {
            const icon = ICONS[a.icon]
            return (
              <li key={a.event}>
                <article className="card award-card">
                  <span className="award-card-mark" aria-hidden="true">
                    <TrophyIcon size={150} />
                  </span>
                  <div className="award-card-top">
                    <picture className="award-card-icon" aria-hidden="true">
                      <source srcSet={icon.still} media="(prefers-reduced-motion: reduce)" />
                      <img src={icon.gif} alt="" width={44} height={44} />
                    </picture>
                    <span className="pill mono">{a.year}</span>
                  </div>
                  <p className="mono award-card-event">{a.event}</p>
                  <h3 className="award-card-title">{a.title[lang]}</h3>
                  <p className="award-card-detail">{a.detail[lang]}</p>
                  <a
                    className="project-link award-card-link"
                    href={a.href}
                    {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {a.cta[lang]}
                    {a.external && <span className="sr-only"> {t.awardsNewTab}</span>}
                    <ArrowIcon />
                  </a>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
