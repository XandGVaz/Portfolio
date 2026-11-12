import { useEffect, useId, useRef, useState } from 'react'
import { resumes, type Lang, type UI } from '../content.ts'
import { ChevronIcon, DownloadIcon } from './Icons.tsx'

export default function ResumeMenu({ t, lang, variant = 'ghost' }: { t: UI; lang: Lang; variant?: 'primary' | 'ghost' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="resume-menu" ref={ref}>
      <button
        type="button"
        className={`btn btn-${variant}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <DownloadIcon /> {t.downloadCv} <ChevronIcon />
      </button>
      {open && (
        <ul id={menuId} className="resume-list" aria-label={t.cvMenuLabel}>
          {resumes.map((r) => {
            const file = r.files[lang] ?? r.files.en
            const englishOnly = lang === 'pt' && !r.files.pt
            return (
              <li key={r.id}>
                <a
                  href={`${import.meta.env.BASE_URL}${file}`}
                  download
                  onClick={() => setOpen(false)}
                >
                  <span className="resume-name">{r.label[lang]}</span>
                  <span className="resume-meta">
                    <span className="resume-meta-text">{englishOnly ? t.cvEnglishOnly : 'PDF'}</span>
                    <span className="resume-lang">{englishOnly ? 'EN' : lang.toUpperCase()}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
