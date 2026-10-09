import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { renderRich } from '../src/components/RichText.jsx'

// RichText mounts a ProseMirror editor, which jsdom can't drive reliably.
// Swap it for a plain textarea that calls onChange with the stored HTML —
// the behavioral contract sections depend on stays identical.
vi.mock('../src/components/RichText.jsx', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: ({ value, onChange }) => (
      <textarea
        aria-label="rich text editor"
        value={String(value ?? '')}
        onChange={e => onChange && onChange(e.target.value)}
      />
    ),
  }
})

const SectionI = (await import('../src/sections/SectionI.jsx')).default

describe('SectionI', () => {
  it('renders the Executive Summary heading', () => {
    render(<SectionI data={{}} onChange={() => {}} />)
    expect(screen.getByText('Executive Summary')).toBeTruthy()
  })

  it('renders with empty data without crashing', () => {
    const { container } = render(<SectionI data={null} onChange={() => {}} />)
    expect(container.querySelectorAll('textarea').length).toBeGreaterThan(0)
  })

  it('calls onChange when a field is edited', () => {
    const onChange = vi.fn()
    const { container } = render(<SectionI data={{}} onChange={onChange} />)

    const editor = container.querySelector('textarea')
    expect(editor).not.toBeNull()

    fireEvent.input(editor, { target: { value: 'My new business idea' } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toMatchObject({ businessIdea: 'My new business idea' })
  })

  it('merges existing data with updated field', () => {
    const existingData = { businessIdea: 'Old idea', targetMarket: 'Everyone' }
    const onChange = vi.fn()
    const { container } = render(<SectionI data={existingData} onChange={onChange} />)

    // Find the field wrapper whose label reads "Target Market", then its editor
    const label = Array.from(container.querySelectorAll('div'))
      .find(el => el.textContent.trim() === 'Target Market')
    expect(label).toBeTruthy()
    const targetEditor = label.parentElement.querySelector('textarea')
    expect(targetEditor).not.toBeNull()

    fireEvent.input(targetEditor, { target: { value: 'Developers' } })

    expect(onChange).toHaveBeenCalledWith({
      businessIdea: 'Old idea',
      targetMarket: 'Developers',
    })
  })
})

describe('renderRich (render pipeline)', () => {
  it('sanitizes stored HTML on render', () => {
    const html = renderRich('<p>ok</p><img src=x onerror=alert(1)>')
    expect(html).toContain('<p>ok</p>')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('alert(1)')
  })

  it('renders legacy plaintext as-is (escaped, paragraphs preserved)', () => {
    const html = renderRich('Line one <not a tag>\n\nLine two')
    expect(html).toContain('Line one &lt;not a tag&gt;')
    expect(html).toContain('Line two')
    expect(html).toMatch(/<p>.*<\/p>/)
  })

  it('returns empty string for empty values', () => {
    expect(renderRich('')).toBe('')
    expect(renderRich(null)).toBe('')
  })
})

describe('App rendering', () => {
  it('App renders the business list heading', async () => {
    // Mock global fetch to prevent network calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    )

    const mod = await import('../src/App.jsx')
    const App = mod.default

    const { container } = render(React.createElement(App))
    expect(container.textContent).toContain('Business Starter')

    delete global.fetch
  })
})