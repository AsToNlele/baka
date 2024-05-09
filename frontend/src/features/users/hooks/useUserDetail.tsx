// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { UserType } from "utils/types"

const userDetail = async (id: number) => {
    return api.get(`/users/${id}`).then((res) => res.data as UserType)
}

export const useUserDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["userList", id],
        queryFn: () => userDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
