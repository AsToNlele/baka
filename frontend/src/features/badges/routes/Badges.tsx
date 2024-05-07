import { PageTitle } from "@/features/app/components/PageTitle"
import { Card, Image } from "@nextui-org/react"
import flowerbed1 from "@/features/badges/assets/flowerbed-1.png"
import flowerbed2 from "@/features/badges/assets/flowerbed-2.png"
import flowerbed3 from "@/features/badges/assets/flowerbed-3.png"
import flowerbed4 from "@/features/badges/assets/flowerbed-4.png"
import flowerbed5 from "@/features/badges/assets/flowerbed-5.png"

export const Badges = () => {
    return (
        <div>
            <PageTitle title="Badges" />

            {/* Badges are divided into own sections */}
            <section>
                <h2>Flowerbeds</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Badge />
                    <Badge />
                    <Badge />
                    <Badge />
                    <Badge />
                </div>
            </section>

        </div>
    )
}

const Badge = () => {
    return (
        <Card>
            <Image src={flowerbed1} alt="flowerbed1" />
        </Card>
    )
}
