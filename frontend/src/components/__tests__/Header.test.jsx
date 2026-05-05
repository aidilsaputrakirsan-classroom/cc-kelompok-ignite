import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header'

describe('Header Component', () => {
  it('menampilkan judul aplikasi', () => {
    render(
      <MemoryRouter>
        <Header totalItems={0} />
      </MemoryRouter>
    )

    expect(screen.getByText('ATHSNAC')).toBeInTheDocument()
  })

  it('menampilkan jumlah total items di cart', () => {
    render(
      <MemoryRouter>
        <Header totalItems={5} user={{}} />
      </MemoryRouter>
    )

    expect(screen.getByText('5')).toBeInTheDocument()
  })
})