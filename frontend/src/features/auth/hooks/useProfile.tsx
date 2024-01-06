import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"

const profile = async () => {
    return api.get("/auth/profile").then((res) => res.data)
}

export const useProfile = () => {
    const query = useQuery({
        queryKey: ["profile"],
        queryFn: profile,
        retry: 0,
    })
    return query
}
