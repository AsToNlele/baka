import {
    ShoppingCartMarketplaceItem,
    ShoppingCartProductItem,
} from "@/features/marketplace/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

type ShoppingCartStore = {
    items: Array<ShoppingCartProductItem | ShoppingCartMarketplaceItem>
    sum: number

    addItem: (
        item: ShoppingCartProductItem | ShoppingCartMarketplaceItem,
    ) => void
    removeItem: (id: number, type: "product" | "marketplaceProduct") => void
    changeQuantity: (
        id: number,
        quantity: number,
        type: "product" | "marketplaceProduct",
    ) => void

    setSum: (sum: number) => void

    currentStep: "step1" | "step2" | "step3" | "step4"
    setCurrentStep: (currentStep: "step1" | "step2" | "step3" | "step4") => void

    orderId: number | null
    setOrderId: (orderId: number | null) => void
}

export const useShoppingCartStore = create<ShoppingCartStore>()(
    devtools((set) => ({
        items: [
            {
                marketplaceProduct: 13,
                quantity: 4,
            },
            {
                marketplaceProduct: 15,
                quantity: 10,
            },
        ],
        sum: 0,
        addItem: (
            item: ShoppingCartProductItem | ShoppingCartMarketplaceItem,
        ) =>
            set(({ items }) => {
                // If id is already in the list, increase quantity
                if ("product" in item) {
                    const index = items.findIndex(
                        (i) => "product" in i && i.product === item.product,
                    )
                    if (index !== -1) {
                        items[index].quantity += item.quantity
                        return { items }
                    }
                } else {
                    const index = items.findIndex(
                        (i) =>
                            "marketplaceProduct" in i &&
                            i.marketplaceProduct === item.marketplaceProduct,
                    )
                    if (index !== -1) {
                        items[index].quantity += item.quantity
                        return { items }
                    }
                }
                // Append new item
                return { items: [...items, item] }
            }),
        removeItem: (id: number, type: "product" | "marketplaceProduct") =>
            set((state) => ({
                ...state,
                items: state.items.filter((item) => {
                    if (type === "product") {
                        return "product" in item && item.product !== id
                    } else {
                        return (
                            "marketplaceProduct" in item &&
                            item.marketplaceProduct !== id
                        )
                    }
                }),
            })),
        changeQuantity: (
            id: number,
            quantity: number,
            type: "product" | "marketplaceProduct",
        ) =>
            set((state) => ({
                ...state,
                items: state.items.map((item) => {
                    if (type === "product") {
                        if ("product" in item && item.product === id) {
                            return { ...item, quantity }
                        }
                    } else {
                        if (
                            "marketplaceProduct" in item &&
                            item.marketplaceProduct === id
                        ) {
                            return { ...item, quantity }
                        }
                    }
                    return item
                }),
            })),
        setSum: (total: number) => set({ sum: total }),

        currentStep: "step1",
        setCurrentStep: (currentStep) => set({ currentStep }),

        orderId: null,
        setOrderId: (orderId) => set({ orderId }),
    })),
)
