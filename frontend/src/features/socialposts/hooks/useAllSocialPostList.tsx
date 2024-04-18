import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { SocialPostAppListResponse } from "utils/types"

const allSocialPostList = async () => {
    return api
        .get("/socialposts/all_posts/")
        .then((res) => res.data as SocialPostAppListResponse)
}

export const useAllSocialPostList = () => {
    const query = useQuery({
        queryKey: ["socialPostListAll"],
        queryFn: allSocialPostList,
        retry: 0,
    })
    return query
}
