import { describe, it, expect } from 'vitest'

describe('Test Setup', () => {
  it('should have working test environment', () => {
    expect(true).toBe(true)
  })

  it('should have access to DOM APIs', () => {
    const element = document.createElement('div')
    element.textContent = 'Test'
    expect(element.textContent).toBe('Test')
  })
})