import { NextUIProvider } from '@nextui-org/react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Landing } from './features/landing/routes/Landing';
import { SignIn } from './features/auth/routes/SignIn';
import { Profile } from './features/auth/routes/Profile';
import { Toaster, toast } from 'sonner';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useProfile } from './features/auth/hooks/useProfile';
import { ReactNode, useEffect } from 'react';
import { SignUp } from './features/auth/routes/SignUp';
import { Loading } from './components/Loading';
import { AppNavbar } from './features/app/components/Navbar';
import { Menu } from './features/app/routes/Menu';
import axios from 'axios';

function App() {
	const navigate = useNavigate();
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				console.log(error)
				if (axios.isAxiosError(error)) {
					if (!error?.request?.responseURL?.includes('/auth/profile')) {
						if (error && error?.message) {
							toast.error(error.message)
						}
					}
				}
			}
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				console.log(error)
				if (axios.isAxiosError(error)) {
					if (error && error?.response?.data?.message) {
						toast.error(error.response.data.message)
					}
				}
			}
		})
	});

	const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
		const navigate = useNavigate();
		const query = useProfile();
		useEffect(() => {
			if (query.error) {
				toast.error('You must be logged in to access this page')
				navigate("/signin", { replace: true });
			}
		}, [query.error])

		return (
			<>
				<AppNavbar />
				{query.isLoading ? <Loading /> : children ? children : <Outlet />}
			</>
		)
	}

	const LoggedInRoute = ({ children }: { children?: ReactNode }) => {
		const navigate = useNavigate();
		const query = useProfile();
		useEffect(() => {
			if (query.isSuccess && !query.isError) {
				navigate("/app", { replace: true });
			}
		}, [query.error, query.isSuccess])

		return query.isLoading ? <Loading /> : children ? children : <Outlet />;
	}


	return (
		<NextUIProvider navigate={navigate}>
			<QueryClientProvider client={queryClient}>
				<main className="text-foreground bg-background">
					<Toaster richColors position='top-right' />
					<Routes>
						<Route index element={<Landing />} />
						<Route element={<LoggedInRoute />}>
							<Route path="/signup" element={<SignUp />} />
							<Route path="/signin" element={<SignIn />} />
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/app" element={<Menu />} />
							<Route path="/app/profile" element={<Profile />} />
						</Route>
						<Route path="*" element={<h1>404</h1>} />
					</Routes>
				</main>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</NextUIProvider >
	);
}

export default App;
