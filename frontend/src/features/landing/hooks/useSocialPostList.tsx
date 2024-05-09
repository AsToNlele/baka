// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { SocialPostListResponse } from "utils/types"

const socialPostList = async () => {
    return api
        .get("/socialposts/")
        .then((res) => res.data as SocialPostListResponse)
}

export const useSocialPostList = () => {
    const query = useQuery({
        queryKey: ["socialPostList"],
        queryFn: socialPostList,
        retry: 0,
    })
    return query
}
