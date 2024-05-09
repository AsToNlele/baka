// Author: Alexandr Celakovsky - xcelak00
import { useUserFlowerbedStats } from "@/features/flowerbeds/hooks/useUserFlowerbedStats"

export const Stats = ({ flowerbedId }: { flowerbedId: number }) => {
    const { data } = useUserFlowerbedStats(flowerbedId)
    return (
        <div>
            <h1 className="mb-2 text-lg font-semibold">Statistics</h1>
            <p>
                CO2 saved:{" "}
                <span className="text-lg text-primary">
                    {data?.emission_sum}
                </span>{" "}
                kg
            </p>
            <p>{data?.emission_sentence}</p>
            <p>
                Saved about{" "}
                <span className="text-secondary">{data?.savings_sum}</span> Kč
            </p>
        </div>
    )
}
