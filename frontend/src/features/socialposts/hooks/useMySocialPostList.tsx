import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { SocialPostAppListResponse } from "utils/types"

const mySocialPostList = async () => {
    return api
        .get("/socialposts/my_posts/")
        .then((res) => res.data as SocialPostAppListResponse)
}

export const useMySocialPostList = () => {
    const query = useQuery({
        queryKey: ["socialPostListMy"],
        queryFn: mySocialPostList,
        retry: 0,
    })
    return query
}
