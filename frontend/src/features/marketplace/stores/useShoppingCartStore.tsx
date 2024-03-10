import { ShoppingCartItem } from "@/features/marketplace/types"
import { GreenhouseProductType } from "@/utils/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

type ShoppingCartStore = {
    
    items: Array<ShoppingCartItem>
    sum: number

    addItem: (item: GreenhouseProductType) => void
    removeItem: (id: number) => void
    changeQuantity: (id: number, quantity: number) => void

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
                marketplaceProduct: 14,
                quantity: 4,
            },
            {
                marketplaceProduct: 15,
                quantity: 10,
            },
        ],
        sum: 0,
        addItem: (item: GreenhouseProductType) =>
            set((state) => ({
                ...state,
                items: [
                    ...state.items,
                    {
                        marketplaceProduct: item.id!,
                        quantity: item.quantity!,
                    },
                ],
            })),
        removeItem: (id: number) =>
            set((state) => ({
                ...state,
                items: state.items.filter((item) => item.marketplaceProduct !== id),
            })),
        changeQuantity: (id: number, quantity: number) =>
            set((state) => ({
                ...state,
                items: state.items.map((item) =>
                    item.marketplaceProduct === id ? { ...item, quantity } : item,
                ),
            })),
        setSum: (total: number) => set({ sum: total }),
        
        currentStep: "step1",
        setCurrentStep: (currentStep) => set({ currentStep }),

        orderId: null,
        setOrderId: (orderId) => set({ orderId }),
    })),
)
