// Author: Alexandr Celakovsky - xcelak00
import { SmallLoading } from "@/components/Loading"
import { useGreenhouseStats } from "@/features/greenhouses/hooks/useGreenhouseStats"
import { Button } from "@nextui-org/react"
import { useState } from "react"
import {
    FaArrowLeft,
    FaArrowRight,
    FaCube,
    FaFire,
    FaMoneyBill,
    FaUser,
} from "react-icons/fa"
import { TbPlant, TbPlantOff } from "react-icons/tb"

export const GreenhouseStats = ({ greenhouseId }: { greenhouseId: number }) => {
    const getCurrentMonth = () => {
        const date = new Date()
        return date.getMonth() + 1
    }
    const getCurrentYear = () => {
        const date = new Date()
        return date.getFullYear()
    }

    const [month, setMonth] = useState(getCurrentMonth())
    const [year, setYear] = useState(getCurrentYear())

    const getPreviousMonth = () => {
        if (month === 1) {
            setMonth(12)
            setYear(year - 1)
        } else {
            setMonth(month - 1)
        }
    }

    const getNextMonth = () => {
        // Don't go into the future
        if (month !== getCurrentMonth() || year !== getCurrentYear()) {
            if (month === 12) {
                setMonth(1)
                setYear(year + 1)
            } else {
                setMonth(month + 1)
            }
        }
    }

    const { data, isLoading, isError } = useGreenhouseStats(
        greenhouseId,
        month,
        year,
    )

    const freeFlowerbeds = data
        ? data?.flowerbed_stats.total_flowerbeds -
        data?.flowerbed_stats.occupied_flowerbeds
        : 0

    return (
        <div className="p-2">
            <h1 className="text-center text-2xl">Greenhouse Stats</h1>
            <div className="flex items-center justify-between">
                <Button onClick={getPreviousMonth} isIconOnly>
                    <FaArrowLeft />
                </Button>
                <h2 className="text-xl">
                    {month}/{year}
                </h2>
                <Button onClick={getNextMonth} isIconOnly>
                    <FaArrowRight />
                </Button>
            </div>
            {!isLoading && !isError ? (
                <div className="mx-2 mt-4 flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-center text-lg font-bold">
                            Turnover
                        </h2>
                        <div className="flex flex-wrap justify-center gap-5">
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Total turnover{" "}
                                    <FaMoneyBill color="green" size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.total_spend}
                                </p>
                            </div>
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Flowerbed total{" "}
                                    <FaMoneyBill color="blue" size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.flowerbed_stats.total_spend}
                                </p>
                            </div>
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Marketplace total
                                    <FaMoneyBill color="red" size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.product_stats.total_spend}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-center text-lg font-bold">
                            Marketplace
                        </h2>
                        <div className="flex flex-wrap justify-center gap-5">
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Orders <FaCube size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.product_stats.total_orders}
                                </p>
                            </div>
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Customers <FaUser size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.product_stats.total_customers}
                                </p>
                            </div>
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Popular products
                                    <FaFire color="red" size={32} />
                                </h3>
                                <p className="font-bold">
                                    {data?.product_stats.popular_products
                                        .slice(0, 5)
                                        .map((product, index) => (
                                            <p>
                                                {index + 1}.{" "}
                                                {product.productName} -{" "}
                                                {product.total_quantity}x
                                            </p>
                                        ))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-center text-lg font-bold">
                            Flowerbeds
                        </h2>
                        <div className="flex flex-wrap justify-center gap-5">
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Occupied flowerbeds{" "}
                                    <TbPlantOff color="green" size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.flowerbed_stats.occupied_flowerbeds}
                                </p>
                            </div>
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Free flowerbeds{" "}
                                    <TbPlant color="blue" size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {freeFlowerbeds}
                                </p>
                            </div>
                            <div className="rounded bg-gray-100 px-6 py-4 text-center shadow">
                                <h3 className="flex gap-4 text-lg">
                                    Total flowerbeds <TbPlant size={32} />
                                </h3>
                                <p className="text-xl font-bold">
                                    {data?.flowerbed_stats.total_flowerbeds}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <SmallLoading />
            )}
        </div>
    )
}
