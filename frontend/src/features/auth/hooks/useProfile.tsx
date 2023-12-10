import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api";

const profile = async () => {
	try {
		const { data } = await api.get('/auth/profile')
		return data
	} catch (error) {
		throw error
	}
}

export const useProfile = () => {
	const query = useQuery(
		{
			queryKey: ['profile'],
			queryFn: profile,
			retry: 0,
		}
	)
	return query;
}
