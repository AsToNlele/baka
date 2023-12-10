import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';
import { LoginForm } from '../components/LoginForm';

export const Login = () => {

	return (
		<div className="flex min-h-full flex-col justify-center px-4 py-12">
			<div className="w-full">
				<Card className="max-w-screen-sm mx-auto">
					<CardHeader className="block p-0 pt-8">
						<h1 className="text-center text-2xl font-semibold">
							Login
						</h1>
					</CardHeader>
					<CardBody className="px-8 py-8 gap-4">
						<div className="flex w-full justify-evenly gap-4">
							<Button fullWidth
								variant='bordered'
								size='lg'
							>
								<FcGoogle size={22} />
								Log in with Google
							</Button>
							<Button fullWidth
								variant='bordered'
								size='lg'
							>
								<FaDiscord size={22} />
								Log in with Discord
							</Button>
						</div>
						<div className="flex justify-center items-center">
							<div className="grow border-b"></div>
							<div className="shrink-0 px-4 text-sm">or</div>
							<div className="grow border-b"></div>
						</div>
						<div className="flex flex-col">
							<LoginForm />
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};
