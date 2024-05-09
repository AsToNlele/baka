// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { ProfileType } from "@/utils/types"

const profile = async () => {
    return api
        .get("/auth/profile")
        .then((res) => res.data)
        .then((data: ProfileType) => data)
}

export const useProfile = () => {
    const query = useQuery({
        queryKey: ["profile"],
        queryFn: profile,
        retry: 0,
    })
    return query
}
