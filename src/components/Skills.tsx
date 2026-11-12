import { useMemo, useState } from 'react'
import { skills, type Lang, type SkillIcon, type UI } from '../content.ts'
import { usageOf } from '../skillUsage.ts'
import { ArrowIcon, CodeIcon, DatabaseIcon, IoTIcon, MonitorIcon, ToolIcon } from './Icons.tsx'
import SectionHeading from './SectionHeading.tsx'

const GROUP_ICONS: Record<SkillIcon, typeof CodeIcon> = {
  code: CodeIcon,
  iot: IoTIcon,
  data: DatabaseIcon,
  front: MonitorIcon,
  tools: ToolIcon,
}

export default function Skills({ t, lang }: { t: UI; lang: Lang }) {
  const [selected, setSelected] = useState<string | null>(null)

  const usage = useMemo(() => {
    const map = new Map<string, ReturnType<typeof usageOf>>()
    skills.forEach((g) => g.items.forEach((s) => map.set(s, usageOf(s))))
    return map
  }, [])

  const used = (s: string) => {
    const u = usage.get(s)
    return !!u && u.projects.length + u.places.length > 0
  }

  const current = selected ? usage.get(selected) : null

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading eyebrow={t.skillsEyebrow} title={t.skillsTitle} lead={t.skillsLead} />

        <div className="skills-grid">
          {skills.map((g) => {
            const GroupIcon = GROUP_ICONS[g.icon]
            return (
            <div key={g.group.en} className={`card skill-group ${g.items.includes(selected ?? '') ? 'has-selected' : ''}`}>
              <h3 className="skill-title">
                <span className="skill-title-icon" aria-hidden="true">
                  <GroupIcon size={16} />
                </span>
                {g.group[lang]}
              </h3>
              <ul className="tags">
                {g.items.map((s) => {
                  if (!used(s)) {
                    return (
                      <li key={s}>
                        <span className="skill-chip is-static">{s}</span>
                      </li>
                    )
                  }
                  const on = selected === s
                  return (
                    <li key={s}>
                      <button
                        type="button"
                        className={`skill-chip ${on ? 'is-on' : ''}`}
                        aria-pressed={on}
                        aria-controls="skill-usage"
                        onClick={() => setSelected(on ? null : s)}
                      >
                        {s}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            )
          })}
        </div>

        <div id="skill-usage" className="skill-usage-slot" aria-live="polite">
          {selected && current && (
            <div className="card skill-usage" key={selected}>
              <div className="skill-usage-head">
                <h3>
                  {t.skillUsedIn} <span className="accent">{selected}</span>
                </h3>
                <button type="button" className="icon-btn" onClick={() => setSelected(null)} aria-label={t.skillClear}>
                  ✕
                </button>
              </div>
              <div className="skill-usage-cols">
                {current.projects.length > 0 && (
                  <div>
                    <p className="skill-usage-label">{t.skillProjects}</p>
                    <ul className="skill-usage-list">
                      {current.projects.map((p) => (
                        <li key={p.id}>
                          <a href={`#project-${p.id}`}>
                            {p.title[lang]} <ArrowIcon />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {current.places.length > 0 && (
                  <div>
                    <p className="skill-usage-label">{t.skillJourney}</p>
                    <ul className="skill-usage-list">
                      {current.places.map((e) => (
                        <li key={e.slug}>
                          <a href={`#/journey/${e.slug}`}>
                            {e.org[lang]} <ArrowIcon />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
