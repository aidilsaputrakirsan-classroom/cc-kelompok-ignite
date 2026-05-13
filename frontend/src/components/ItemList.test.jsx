import { render, screen, waitFor } from "@testing-library/react"
import ItemList from "./ItemList"
import { vi } from "vitest"

vi.mock("../services/api", () => ({
    fetchItems: vi.fn(),
}))

vi.mock("./ItemCard", () => ({
    default: ({ item }) => <div>{item.name}</div>,
}))

import { fetchItems } from "../services/api"

describe("ItemList Component", () => {
    test("menampilkan loading", () => {
        fetchItems.mockResolvedValue({
            products: [],
        })

        render(<ItemList />)

        expect(
            screen.getByText("Memuat produk...")
        ).toBeInTheDocument()
    })

    test("menampilkan empty state", async () => {
        fetchItems.mockResolvedValue({
            products: [],
        })

        render(<ItemList />)

        await waitFor(() => {
            expect(
                screen.getByText("Tidak ada produk.")
            ).toBeInTheDocument()
        })
    })

    test("menampilkan item produk", async () => {
        fetchItems.mockResolvedValue({
            products: [
                {
                    id: 1,
                    name: "Amplang",
                    is_active: true,
                    price: 10000,
                },
            ],
        })

        render(<ItemList />)

        await waitFor(() => {
            expect(
                screen.getByText("Amplang")
            ).toBeInTheDocument()
        })
    })

    test("menampilkan error", async () => {
        fetchItems.mockRejectedValue(
            new Error("API Error")
        )

        render(<ItemList />)

        await waitFor(() => {
            expect(
                screen.getByText(/Terjadi kesalahan/)
            ).toBeInTheDocument()
        })
    })
})