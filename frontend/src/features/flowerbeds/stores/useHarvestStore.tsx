// Author: Alexandr Celakovsky - xcelak00
import { FlowerbedHarvestType } from "@/utils/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

type HarvestStore = {
    localHarvests: Array<FlowerbedHarvestType>
    setLocalHarvests: (localHarvests: Array<FlowerbedHarvestType>) => void
}

export const useHarvestStore = create<HarvestStore>()(
    devtools((set) => ({
        localHarvests: [],
        setLocalHarvests: (localHarvests) => set({ localHarvests }),
    })),
)
