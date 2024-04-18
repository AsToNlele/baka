import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { SocialPostAppType } from "utils/types"

const socialPostDetail = async (id: number) => {
    return api
        .get(`/socialposts/${id}`)
        .then((res) => res.data as SocialPostAppType)
}

export const useSocialPostDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["socialPostList", id],
        queryFn: () => socialPostDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
