// Author: Alexandr Celakovsky - xcelak00
import { Button, Image, Link } from "@nextui-org/react"
import Navbar from "../components/Navbar"
import { SocialMediaPosts } from "@/features/landing/components/SocialMediaPosts"

import levelSystem from "../assets/level-system.png"
import marketplace from "../assets/marketplace.png"

export const Landing = () => {
    return (
        <div className="min-h-screen w-full landing-theme">
            <Navbar />
            <div className="mx-auto max-w-[1024px] px-4 py-8 lg:gap-8 lg:py-16 xl:gap-0">
                <div className="grid max-w-[1024px] gap-4 lg:grid-cols-12 lg:gap-8">
                    <div className="mr-auto place-self-start lg:col-span-7">
                        <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
                            Got nowhere to grow your plants?
                        </h1>
                        <p className="mb-6 max-w-2xl text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                            We've got you covered! Start growing your plants
                            today in one of our greenhouses.
                        </p>
                        <Button
                            href="/signup"
                            as={Link}
                            size="lg"
                            className="px-12 shadow-xl hover:-translate-y-1"
                            color="primary"
                        >
                            Start growing now
                        </Button>

                        <div className="mt-16 flex flex-col-reverse gap-4 md:flex-row">
                            <Image src={levelSystem} alt="level-system" />
                            <div className="">
                                <h2 className="text-3xl font-extrabold">
                                    Collect rewards
                                </h2>
                                <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                                    Complete our challenges and level up to earn rewards.
                                </p>
                            </div>
                        </div>
                        <div className="mt-16 flex flex-col gap-4 md:flex-row">
                            <div className="">
                                <h2 className="text-3xl font-extrabold">
                                    Checkout our marketplace
                                </h2>
                                <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                                    Buy seeds, plants, and more from our marketplace.
                                </p>
                            </div>
                            <Image src={marketplace} alt="level-system" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center lg:col-span-5 lg:mt-0">
                        <SocialMediaPosts />
                    </div>
                </div>
            </div>
        </div>
    )
}
