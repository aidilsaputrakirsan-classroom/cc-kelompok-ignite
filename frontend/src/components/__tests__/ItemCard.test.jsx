import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ItemCard from '../ItemCard'

const mockItem = {
  id: 1,
  name: 'Laptop',
  description: 'Laptop untuk cloud computing',
  price: 15000000,
  stock: 5,
  category: 'Elektronik',
}

describe('ItemCard Component', () => {
  it('menampilkan nama dan harga item', () => {
    render(
      <MemoryRouter>
        <ItemCard
          item={mockItem}
          onEdit={() => {}}
          onDelete={() => {}}
          isAdmin={true}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText(/Rp\s?15\.000\.000/i)).toBeInTheDocument()
  })

  it('memanggil onEdit saat tombol edit diklik', () => {
    const handleEdit = vi.fn()

    render(
      <MemoryRouter>
        <ItemCard
          item={mockItem}
          onEdit={handleEdit}
          onDelete={() => {}}
          isAdmin={true}
        />
      </MemoryRouter>
    )

    const editButton = screen.getByText(/edit/i)
    fireEvent.click(editButton)

    expect(handleEdit).toHaveBeenCalledWith(mockItem)
  })

  it('memanggil onDelete saat tombol hapus diklik', () => {
    const handleDelete = vi.fn()

    render(
      <MemoryRouter>
        <ItemCard
          item={mockItem}
          onEdit={() => {}}
          onDelete={handleDelete}
          isAdmin={true}
        />
      </MemoryRouter>
    )

    const deleteButton = screen.getByText(/hapus/i)
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledWith(mockItem.id)
  })
})