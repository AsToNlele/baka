import { Button, Link } from '@nextui-org/react';
import Navbar from '../components/Navbar';

export const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h1>
          <p className="max-w-2xl mb-6 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            In lacinia dolor sollicitudin felis cursus porta. Sed sodales porta
            mauris eget porta. Curabitur iaculis elementum consectetur. Etiam at
            magna mi. Nam et nunc ac metus mollis faucibus quis ac diam.
          </p>
          <Button
            href="/signup"
            as={Link}
            color="primary"
            size="lg"
            variant="flat"
            className="hover:-translate-y-1 px-12 shadow-xl"
          >
            Get started
          </Button>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
            alt="mockup"
          />
        </div>
      </div>
    </>
  );
};
