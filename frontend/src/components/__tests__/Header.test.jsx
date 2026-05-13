import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header'
import { ThemeProvider } from '../../context/ThemeContext'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('Header Component', () => {
  it('menampilkan judul aplikasi', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header totalItems={0} />
        </MemoryRouter>
      </ThemeProvider>
    )

    expect(screen.getByText('ATHSNACK')).toBeInTheDocument()
  })

  it('menampilkan jumlah total items di cart', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header totalItems={5} user={{}} />
        </MemoryRouter>
      </ThemeProvider>
    )

    expect(screen.getByText('5')).toBeInTheDocument()
  })
})