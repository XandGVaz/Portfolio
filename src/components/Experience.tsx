import { awards, experience, type Lang, type UI } from '../content.ts'

export default function ExperienceSection({ t, lang }: { t: UI; lang: Lang }) {
  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">{t.experienceTitle}</h2>

        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.org} className="timeline-item">
              <div className="timeline-head">
                <div>
                  <h3 className="timeline-role">{e.role[lang]}</h3>
                  <p className="timeline-org">{e.org}</p>
                </div>
                <span className="mono timeline-period">{e.period[lang]}</span>
              </div>
              <ul className="timeline-points">
                {e.points[lang].map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="split">
          <div className="card">
            <h3 className="card-title">{t.educationTitle}</h3>
            <p className="strong">{t.education.school}</p>
            <p className="muted">{t.education.degree}</p>
            <p className="mono muted small">{t.education.period}</p>
          </div>
          <div className="card">
            <h3 className="card-title">{t.awardsTitle}</h3>
            <ul className="awards">
              {awards.map((a) => (
                <li key={a.en}>{a[lang]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
