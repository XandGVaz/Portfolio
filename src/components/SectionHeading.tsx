// Título de seção centralizado, padrão de todas as seções principais:
// rótulo em cima, título com a parte final em destaque, traço e texto de apoio opcional.
export default function SectionHeading({ eyebrow, title, lead }: { eyebrow: string; title: string[]; lead?: string }) {
  const [first, ...rest] = title
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">
        {first} <span className="accent">{rest.join(' ')}</span>
      </h2>
      <span className="section-rule" aria-hidden="true" />
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  )
}
