import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { UserListType } from "utils/types"

const userList = async () => {
    return api
        .get("/users")
        .then((res) => res.data)
        .then((data) => data.results as UserListType)
}

export const useUserList = () => {
    const query = useQuery({
        queryKey: ["userList"],
        queryFn: userList,
        retry: 0,
    })
    return query
}
