import { skills, type Lang, type UI } from '../content.ts'

export default function Skills({ t, lang }: { t: UI; lang: Lang }) {
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">{t.skillsTitle}</h2>
        <div className="skills-grid">
          {skills.map((g) => (
            <div key={g.group.en} className="skill-group">
              <h3 className="skill-title">{g.group[lang]}</h3>
              <ul className="tags">
                {g.items.map((s) => (
                  <li key={s} className="tag">{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
