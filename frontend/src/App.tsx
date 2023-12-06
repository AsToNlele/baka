import { NextUIProvider } from '@nextui-org/react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Landing } from './features/landing/routes/Landing';
import { Login } from './features/auth/routes/Login';
import { Profile } from './features/auth/routes/Profile';

function App() {
	const navigate = useNavigate();

	return (
		<NextUIProvider navigate={navigate}>
			<main className="text-foreground bg-background">
				<Routes>
					<Route index element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="*" element={<h1>404</h1>} />
				</Routes>
			</main>
		</NextUIProvider>
	);
}

export default App;
