import { useEffect, useRef, useState } from 'react'
import type { Lang, UI } from '../content.ts'
import type { JourneyImage, JourneySection } from '../journey.ts'
import Carousel from './Carousel.tsx'
import { CheckIcon, FlagIcon } from './Icons.tsx'

// Linha do tempo vertical de checkpoints, interativa:
// - acompanha a rolagem: checkpoints já passados ficam preenchidos (✓),
//   o atual fica destacado e o trecho percorrido da linha fica em azul forte;
//   ao terminar a linha do tempo, todos ficam marcados, inclusive o último;
// - acima de cada título aparece o período da etapa;
// - clicar num marcador rola até aquele checkpoint.
interface Props {
  sections: JourneySection[]
  t: UI
  lang: Lang
  carouselLabels: { prev: string; next: string; open: string; close: string }
  flash?: number | null // checkpoint destacado por um instante (vindo de um card ou do gráfico)
}

// Um checkpoint passa a ser o "atual" quando o topo dele cruza esta linha da tela.
const ACTIVE_LINE = 0.4

export default function Checkpoints({ sections, t, lang, carouselLabels, flash }: Props) {
  const items = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(-1)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * ACTIVE_LINE
      let current = -1
      items.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i
      })
      // Linha do tempo concluída: todos os checkpoints ficam marcados (✓), inclusive
      // o último, quando o fim dele passa da linha ou a página chega ao fim.
      // (`active` = número de checkpoints significa "nenhum atual, todos concluídos".)
      const last = items.current[sections.length - 1]
      const lastPassed = !!last && last.getBoundingClientRect().bottom <= line
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      if (current >= 0 && (lastPassed || atBottom)) current = sections.length
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections.length])

  const goTo = (i: number) => {
    items.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <ol className="checkpoints">
      {sections.map((s, i) => {
        const state = i < active ? 'is-done' : i === active ? 'is-active' : 'is-upcoming'
        const step = String(i + 1).padStart(2, '0')
        return (
          <li
            key={s.title.en}
            id={`checkpoint-${i}`}
            ref={(el) => {
              items.current[i] = el
            }}
            className={`checkpoint ${state} ${flash === i ? 'is-flash' : ''}`}
          >
            <button
              type="button"
              className="checkpoint-node"
              onClick={() => goTo(i)}
              aria-label={`${t.checkpoint} ${step}: ${s.title[lang]}${s.period ? ` (${s.period[lang]})` : ''}`}
              aria-current={i === active ? 'step' : undefined}
            >
              {i < active ? <CheckIcon /> : <FlagIcon />}
            </button>
            <section className="journey-section">
              {s.period && <p className="checkpoint-step">{s.period[lang]}</p>}
              <h2>{s.title[lang]}</h2>
              <p>{s.body[lang]}</p>
              {s.images && s.images.length > 0 && (
                <Carousel images={s.images as JourneyImage[]} lang={lang} labels={carouselLabels} />
              )}
            </section>
          </li>
        )
      })}
    </ol>
  )
}
