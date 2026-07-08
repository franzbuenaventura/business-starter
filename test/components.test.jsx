import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import SectionI from '../src/sections/SectionI.jsx'

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

    // Find the first textarea directly
    const textarea = container.querySelector('textarea')
    expect(textarea).not.toBeNull()

    // Use fireEvent.input since some jsdom setups handle input better
    fireEvent.input(textarea, { target: { value: 'My new business idea' } })

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('merges existing data with updated field', () => {
    const existingData = { businessIdea: 'Old idea', targetMarket: 'Everyone' }
    const onChange = vi.fn()
    const { container } = render(<SectionI data={existingData} onChange={onChange} />)

    // Find the textarea after the "Target Market" label
    const labels = container.querySelectorAll('label')
    let targetTextarea = null
    for (const label of labels) {
      if (label.textContent.toLowerCase().includes('target market')) {
        // The textarea should be the next sibling or inside the parent div
        const parent = label.closest('div')
        targetTextarea = parent ? parent.querySelector('textarea') : null
        break
      }
    }
    expect(targetTextarea).not.toBeNull()

    fireEvent.input(targetTextarea, { target: { value: 'Developers' } })

    expect(onChange).toHaveBeenCalledWith({
      businessIdea: 'Old idea',
      targetMarket: 'Developers',
    })
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