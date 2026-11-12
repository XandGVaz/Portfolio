import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lang } from '../content.ts'
import type { JourneyImage } from '../journey.ts'
import Lightbox from './Lightbox.tsx'

// Carrossel horizontal de fotos, paginado por setas (e arrastável no celular).
// Os cards têm tamanho fixo; clicar em um abre a imagem inteira no Lightbox.

const ExpandIcon = () => (
  <span className="photo-expand" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  </span>
)
interface Props {
  images: JourneyImage[]
  lang: Lang
  labels: { prev: string; next: string; open: string; close: string }
}

export default function Carousel({ images, lang, labels }: Props) {
  const track = useRef<HTMLUListElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const base = import.meta.env.BASE_URL

  // Uma "página" é a largura visível mais um espaço entre cards: com N colunas
  // de largura W e espaço G, a faixa mede N·W + (N−1)·G, e a área visível,
  // P·W + (P−1)·G. Somando G aos dois lados, a razão vira exatamente N/P.
  const pageStep = (el: HTMLElement) => el.clientWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)

  // Recalcula página atual e total a partir da rolagem e da largura visível.
  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const step = pageStep(el)
    const gap = step - el.clientWidth
    // Arredonda para cima: com um card largo (2 colunas) a faixa pode ter, por
    // exemplo, 4 colunas para 3 visíveis, o que ainda exige uma segunda página.
    // A folga de 2% evita contar uma página extra por diferença de subpixel.
    const total = Math.max(1, Math.ceil((el.scrollWidth + gap) / step - 0.02))
    setPages(total)
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setPage(atEnd ? total - 1 : Math.round(el.scrollLeft / step))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [measure])

  const go = (dir: -1 | 1) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * pageStep(el), behavior: 'smooth' })
  }

  return (
    <div className="carousel">
      <ul className="carousel-track" ref={track}>
        {images.map((img, i) =>
          img.fit === 'screen' || img.fit === 'diagram' ? (
            <li key={img.src} className={`carousel-slide is-wide ${img.featured ? 'is-full' : ''}`}>
              <button
                type="button"
                className={`screen-card ${img.fit === 'diagram' ? 'is-diagram' : ''}`}
                onClick={() => setOpen(i)}
                aria-label={`${labels.open}: ${img.title[lang]}`}
              >
                {img.fit === 'screen' && (
                  <span className="screen-bar" aria-hidden="true">
                    <span className="window-dots">
                      <i /> <i /> <i />
                    </span>
                  </span>
                )}
                <img
                  src={`${base}${img.src}`}
                  alt={img.title[lang]}
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                  decoding="async"
                />
                <span className="screen-meta">
                  <span>
                    <span className="photo-tag">{img.tag[lang]}</span>
                    <span className="screen-title">{img.title[lang]}</span>
                  </span>
                  <ExpandIcon />
                </span>
              </button>
            </li>
          ) : (
            <li key={img.src} className="carousel-slide">
              <button
                type="button"
                className={`photo-card ${img.fit === 'contain' ? 'is-contain' : ''}`}
                onClick={() => setOpen(i)}
                aria-label={`${labels.open}: ${img.title[lang]}`}
              >
                <img
                  src={`${base}${img.src}`}
                  alt={img.title[lang]}
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                  decoding="async"
                  style={img.pos ? { objectPosition: img.pos } : undefined}
                />
                <span className="photo-overlay" aria-hidden="true" />
                <span className="photo-meta">
                  <span>
                    <span className="photo-tag">{img.tag[lang]}</span>
                    <span className="photo-title">{img.title[lang]}</span>
                  </span>
                  <ExpandIcon />
                </span>
              </button>
            </li>
          ),
        )}
      </ul>

      {pages > 1 && (
        <div className="carousel-controls">
          <button type="button" className="carousel-arrow" onClick={() => go(-1)} disabled={page === 0} aria-label={labels.prev}>
            ‹
          </button>
          <span className="mono muted small" aria-live="polite">
            {page + 1} / {pages}
          </span>
          <button type="button" className="carousel-arrow" onClick={() => go(1)} disabled={page >= pages - 1} aria-label={labels.next}>
            ›
          </button>
        </div>
      )}

      {open !== null && (
        <Lightbox images={images} index={open} lang={lang} closeLabel={labels.close} onClose={close} onNavigate={setOpen} />
      )}
    </div>
  )
}
