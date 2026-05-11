import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SearchBar from "./SearchBar"
import { vi } from "vitest"

describe("SearchBar Component", () => {
    test("input bisa diketik", async () => {
        render(
            <SearchBar
                onSearch={vi.fn()}
                activeFilter="semua"
                onFilterChange={vi.fn()}
            />
        )

        const input = screen.getByPlaceholderText("Cari Produk....")

        await userEvent.type(input, "Bakso")

        expect(input.value).toBe("Bakso")
    })

    test("button hapus muncul saat input diisi", async () => {
        render(
            <SearchBar
                onSearch={vi.fn()}
                activeFilter="semua"
                onFilterChange={vi.fn()}
            />
        )

        const input = screen.getByPlaceholderText("Cari Produk....")

        await userEvent.type(input, "Test")

        expect(screen.getByText("Hapus")).toBeInTheDocument()
    })

    test("button hapus mengosongkan input", async () => {
        const onSearch = vi.fn()

        render(
            <SearchBar
                onSearch={onSearch}
                activeFilter="semua"
                onFilterChange={vi.fn()}
            />
        )

        const input = screen.getByPlaceholderText("Cari Produk....")

        await userEvent.type(input, "Mie")

        await userEvent.click(screen.getByText("Hapus"))

        expect(input.value).toBe("")
    })

    test("submit memanggil onSearch", async () => {
        const onSearch = vi.fn()

        render(
            <SearchBar
                onSearch={onSearch}
                activeFilter="semua"
                onFilterChange={vi.fn()}
            />
        )

        const input = screen.getByPlaceholderText("Cari Produk....")

        await userEvent.type(input, "Snack")

        await userEvent.click(screen.getByText("Cari"))

        expect(onSearch).toHaveBeenCalled()
    })
})