import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ItemForm from "./ItemForm"
import { vi } from "vitest"

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

describe("ItemForm Component", () => {
    test("render form dengan benar", () => {
        render(<ItemForm />)

        expect(screen.getByText("➕ Tambah Produk Baru")).toBeInTheDocument()
    })

    test("validasi nama kosong muncul", async () => {
        render(<ItemForm />)

        await userEvent.click(
            screen.getByText("✅ Tambah Produk")
        )

        expect(
            screen.getByText("Nama produk wajib diisi")
        ).toBeInTheDocument()
    })

    test("validasi harga muncul", async () => {
        render(<ItemForm />)

        await userEvent.type(
            screen.getByPlaceholderText("Contoh: Amplang Balikpapan"),
            "Amplang"
        )

        await userEvent.click(
            screen.getByText("✅ Tambah Produk")
        )

        expect(
            screen.getByText("Harga harus lebih dari 0")
        ).toBeInTheDocument()
    })

    test("input name bisa diisi", async () => {
        render(<ItemForm />)

        const input = screen.getByPlaceholderText(
            "Contoh: Amplang Balikpapan"
        )

        await userEvent.type(input, "Kerupuk")

        expect(input.value).toBe("Kerupuk")
    })

    test("submit berhasil memanggil onSuccess", async () => {
        const onSuccess = vi.fn()

        render(<ItemForm onSuccess={onSuccess} />)

        await userEvent.type(
            screen.getByPlaceholderText("Contoh: Amplang Balikpapan"),
            "Produk Baru"
        )

        await userEvent.type(
            screen.getByPlaceholderText("Contoh: 25000"),
            "10000"
        )

        await userEvent.click(
            screen.getByText("✅ Tambah Produk")
        )

        expect(onSuccess).toHaveBeenCalled()
    })
})