import { Button, Card, CardBody, CardHeader, Link } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';
import { SignInForm } from '../components/SignInForm';

export const SignIn = () => {
	return (
		<div className="flex min-h-full flex-col justify-center px-4 py-12">
			<div className="w-full">
				<Card className="max-w-screen-sm mx-auto">
					<CardHeader className="block p-0 pt-8">
						<h1 className="text-center text-2xl font-semibold">
							Sign In
						</h1>
					</CardHeader>
					<CardBody className="px-8 py-8 gap-4">
						<div className="flex flex-col sm:flex-row w-full justify-evenly gap-4">
							<Button fullWidth
								variant='bordered'
								size='lg'
							>
								Sign in with
								<FcGoogle size={22} />
							</Button>
							<Button fullWidth
								variant='bordered'
								size='lg'
							>
								Sign in with
								<FaDiscord size={22} />
							</Button>
						</div>
						<div className="flex justify-center items-center">
							<div className="grow border-b"></div>
							<div className="shrink-0 px-4 text-sm">or</div>
							<div className="grow border-b"></div>
						</div>
						<div className="flex flex-col">
							<SignInForm />
						</div>
						<div>
							<Link href="/signup">Don't have an account? Sign up!</Link>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};
