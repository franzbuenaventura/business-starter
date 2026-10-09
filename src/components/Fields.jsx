import { Card, CardBody, Input as HeroInput } from '@heroui/react'
import RichText from './RichText.jsx'

/* ── Section layout kit ──────────────────────────────────────
   Shared by all 10 section components. Replaces the per-file
   inline-styled label/hint/input/textarea blocks.              */

export function SectionPage({ title, intro, children }) {
  return (
    <div className="max-w-3xl mx-auto pb-16">
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      {intro && <p className="text-sm text-foreground-500 mb-6 leading-relaxed">{intro}</p>}
      {children}
    </div>
  )
}

/* Numbered group card with GroupTitle header */
export function Group({ title, hint, children, number }) {
  return (
    <Card shadow="none" className="border border-divider bg-content1 mb-6">
      <CardBody className="px-5 py-5">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {number && <span className="text-primary mr-2">{number}</span>}
          {title}
        </h3>
        {hint && <p className="text-sm text-foreground-500 mb-4 leading-relaxed">{hint}</p>}
        {!hint && <div className="mb-4" />}
        {children}
      </CardBody>
    </Card>
  )
}

/* Field: label + hint + control.
   type: 'rich' (default, long-form WYSIWYG) | 'text' | 'number' */
export function Field({ label, hint, type = 'rich', value, onChange, placeholder, tall, min, max, step, className }) {
  return (
    <div className={`mb-5 last:mb-0 ${className || ''}`}>
      <div className="text-sm font-medium text-foreground mb-1">{label}</div>
      {hint && <div className="text-xs text-foreground-500 mb-2 leading-relaxed">{hint}</div>}
      {type === 'rich' ? (
        <RichText value={value} onChange={onChange} placeholder={placeholder} tall={tall} />
      ) : type === 'number' ? (
        <HeroInput
          type="number" min={min} max={max} step={step}
          value={String(value ?? '')}
          onValueChange={onChange}
          placeholder={placeholder}
          size="sm" variant="bordered"
        />
      ) : (
        <HeroInput
          type="text"
          value={String(value ?? '')}
          onValueChange={onChange}
          placeholder={placeholder}
          size="sm" variant="bordered"
        />
      )}
    </div>
  )
}

/* Multi-column field row (1 col on phones) */
export function Row({ cols = 2, children }) {
  const colClass = cols === 3 ? 'sm:grid-cols-3' : cols === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'
  return <div className={`grid grid-cols-1 ${colClass} gap-4 mb-1`}>{children}</div>
}

/* Sub-label inside a group (e.g. "Assets") */
export function SubTitle({ children }) {
  return <div className="text-sm font-semibold text-foreground-600 mt-4 mb-3">{children}</div>
}

/* Light native input for dense tables (12-column grids) */
export function CellInput({ value, onChange, placeholder, type = 'text', align = 'left' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent px-1.5 py-1 rounded text-xs outline-none border border-transparent focus:border-primary focus:bg-content2 ${
        align === 'right' ? 'text-right' : ''
      } text-foreground`}
    />
  )
}