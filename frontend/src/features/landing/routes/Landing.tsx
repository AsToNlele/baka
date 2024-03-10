import { Button, Link } from "@nextui-org/react"
import Navbar from "../components/Navbar"

export const Landing = () => {
    return (
        <div className="min-h-screen w-full landing-theme">
            <Navbar />
            <div className="mx-auto grid max-w-[1024px] px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </h1>
                    <p className="mb-6 max-w-2xl text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                        In lacinia dolor sollicitudin felis cursus porta. Sed
                        sodales porta mauris eget porta. Curabitur iaculis
                        elementum consectetur. Etiam at magna mi. Nam et nunc ac
                        metus mollis faucibus quis ac diam.
                    </p>
                    <Button
                        href="/signup"
                        as={Link}
                        size="lg"
                        className="px-12 shadow-xl hover:-translate-y-1"
                        color="primary"
                    >
                        Start growing
                    </Button>
                </div>
                <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
                    <img
                        className="size-full object-contain"
                        // src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
                        src="/plant.png"
                        alt="mockup"
                    />
                </div>
            </div>
        </div>
    )
}
