import { NextUIProvider, Spinner } from '@nextui-org/react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Landing } from './features/landing/routes/Landing';
import { Login } from './features/auth/routes/Login';
import { Profile } from './features/auth/routes/Profile';
import { Toaster, toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useProfile } from './features/auth/hooks/useProfile';
import { ReactNode, useEffect } from 'react';

function App() {
	const navigate = useNavigate();
	const queryClient = new QueryClient();

	const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
		const navigate = useNavigate();
		const query = useProfile();
		useEffect(() => {
			if (query.error) {
				toast.error('You must be logged in to access this page')
				navigate("/login", { replace: true });
			}
		}, [query.error])

		return query.isLoading ? <Spinner /> : children ? children : <Outlet />;
	}

	const LoggedInRoute = ({ children }: { children?: ReactNode }) => {
		const navigate = useNavigate();
		const query = useProfile();
		useEffect(() => {
			if (query.isSuccess && !query.isError) {
				navigate("/app", { replace: true });
			}
		}, [query.error, query.isSuccess])

		return query.isLoading ? <Spinner /> : children ? children : <Outlet />;
	}


	return (
		<NextUIProvider navigate={navigate}>
			<QueryClientProvider client={queryClient}>
				<main className="text-foreground bg-background">
					<Toaster richColors position='top-right' />
					<Routes>
						<Route index element={<Landing />} />
						<Route element={<LoggedInRoute />}>
							<Route path="/register" element={<h1>Register</h1>} />
							<Route path="/login" element={<Login />} />
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/app" element={<h1>App</h1>} />
							<Route path="/profile" element={<Profile />} />
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
