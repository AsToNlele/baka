import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react"
import { FcGoogle } from "react-icons/fc"
import { FaDiscord } from "react-icons/fa"
import { SignInForm } from "../components/SignInForm"

export const SignIn = () => {
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12">
            <div className="w-full">
                <Card className="mx-auto max-w-screen-sm">
                    <CardHeader className="block p-0 pt-8">
                        <h1 className="text-center text-2xl font-semibold">
                            Sign In
                        </h1>
                    </CardHeader>
                    <CardBody className="gap-4 p-8">
                        {/* <div className="flex w-full flex-col justify-evenly gap-4 sm:flex-row"> */}
                        {/*     <Button fullWidth variant="bordered" size="lg"> */}
                        {/*         Sign in with */}
                        {/*         <FcGoogle size={22} /> */}
                        {/*     </Button> */}
                        {/*     <Button fullWidth variant="bordered" size="lg"> */}
                        {/*         Sign in with */}
                        {/*         <FaDiscord size={22} /> */}
                        {/*     </Button> */}
                        {/* </div> */}
                        {/* <div className="flex items-center justify-center"> */}
                        {/*     <div className="grow border-b"></div> */}
                        {/*     <div className="shrink-0 px-4 text-sm">or</div> */}
                        {/*     <div className="grow border-b"></div> */}
                        {/* </div> */}
                        <div className="flex flex-col">
                            <SignInForm />
                        </div>
                        <div>
                            <Link href="/signup" color="secondary">
                                Don't have an account? Sign up!
                            </Link>
                        </div>
                        <div>
                            <Link href="/reset-password" color="secondary">
                                Forgot your password? Reset it!
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
