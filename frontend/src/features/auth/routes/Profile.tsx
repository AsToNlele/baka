import { SignOutButton } from '../components/SignOutButton';
import { useProfile } from '../hooks/useProfile';

export const Profile = () => {
	const profile = useProfile();
	return (
		<>
			Profile
			{JSON.stringify(profile.data)}
			<SignOutButton />
		</>
	);
};
