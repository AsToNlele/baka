// Author: Alexandr Celakovsky - xcelak00
import { Greenhouse } from "../components/Greenhouse"
import { useMyGreenhouseList } from "@/features/greenhouses/hooks/useMyGreenhouseList"

export const MyGreenhouses = () => {
    const { data: greenhouses } = useMyGreenhouseList()

    return (
        <>
            <h1 className="mb-8 text-3xl">My Greenhouses</h1>
            <div className="flex items-start gap-4">
                <div className="grid grow grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {greenhouses?.map((item, i) => (
                        <Greenhouse item={item} key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}
