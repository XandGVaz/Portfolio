// Onde cada tecnologia da seção "Tecnologias" foi usada: nos projetos em destaque
// (content.ts) e nas subpáginas da jornada (journey.ts).
// Os nomes nem sempre coincidem entre as listas ("Apache Kafka" × "Kafka",
// "C" × "C/C++"), então cada tecnologia lista os nomes equivalentes.

import { experience, projects, type Experience, type Project } from './content.ts'
import { journeyDetails } from './journey.ts'

const ALIASES: Record<string, string[]> = {
  C: ['C', 'C/C++'],
  'C++': ['C++', 'C/C++', 'C++17'],
  Java: ['Java', 'Java 21'],
  SQL: ['SQL', 'PostgreSQL', 'PostgreSQL/TimescaleDB'],
  'LoRa / LoRaWAN': ['LoRa', 'LoRaWAN'],
  PostgreSQL: ['PostgreSQL', 'PostgreSQL/TimescaleDB'],
  TimescaleDB: ['TimescaleDB', 'PostgreSQL/TimescaleDB'],
  'Apache Kafka': ['Kafka', 'Apache Kafka'],
  Docker: ['Docker', 'Docker Compose'],
}

// Ferramentas usadas em todos os projetos e lugares, mesmo sem aparecer na stack.
const EVERYWHERE = new Set(['Git'])

const norm = (s: string) => s.trim().toLowerCase()

function matches(skill: string, stack: string[]): boolean {
  const names = (ALIASES[skill] ?? [skill]).map(norm)
  return stack.some((s) => names.includes(norm(s)))
}

export interface SkillUsage {
  projects: Project[]
  places: Experience[]
}

export function usageOf(skill: string): SkillUsage {
  if (EVERYWHERE.has(skill)) return { projects: [...projects], places: [...experience] }
  return {
    projects: projects.filter((p) => matches(skill, p.stack)),
    places: experience.filter((e) => matches(skill, journeyDetails[e.slug]?.stack ?? [])),
  }
}
