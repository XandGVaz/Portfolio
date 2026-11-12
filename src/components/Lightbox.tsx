import { useEffect } from 'react'
import type { Lang } from '../content.ts'
import type { JourneyImage } from '../journey.ts'

interface Props {
  images: JourneyImage[]
  index: number
  lang: Lang
  closeLabel: string
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ images, index, lang, closeLabel, onClose, onNavigate }: Props) {
  const img = images[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [index, images.length, onClose, onNavigate])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={img.title[lang]} onClick={onClose}>
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={`${import.meta.env.BASE_URL}${img.src}`} alt={img.title[lang]} width={img.w} height={img.h} />
        <figcaption>
          <strong>{img.title[lang]}</strong>
          <span>{img.caption[lang]}</span>
          <span className="mono muted small">
            {index + 1} / {images.length}
          </span>
        </figcaption>
      </figure>
      <button type="button" className="lightbox-close icon-btn" onClick={onClose} aria-label={closeLabel}>
        ✕
      </button>
    </div>
  )
}
