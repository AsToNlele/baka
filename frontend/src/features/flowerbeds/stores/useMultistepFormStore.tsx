import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { DateRange } from "react-day-picker"

type MultistepFormStore = {
    currentStep: "step1" | "step2" | "step3"
    setCurrentStep: (currentStep: "step1" | "step2" | "step3") => void

    dateRange: DateRange | undefined
    setDateRange: (dateRange: DateRange | undefined) => void

    orderId: number | null
    setOrderId: (orderId: number | null) => void
}

export const useMultistepFormStore = create<MultistepFormStore>()(
    devtools((set) => ({
        currentStep: "step1",
        setCurrentStep: (currentStep) => set({ currentStep }),

        dateRange: undefined,
        setDateRange: (dateRange) => set({ dateRange }),

        orderId: null,
        setOrderId: (orderId) => set({ orderId }),
    })),
)
