import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { NewsletterPostListResponse } from "@/utils/types"

const newsletterPostList = async () => {
    return api
        .get(`/newsletter/history/`)
        .then((res) => res.data as NewsletterPostListResponse)
}

export const useNewsletterPostList = () => {
    const query = useQuery({
        queryKey: ["newsletterPostList"],
        queryFn: newsletterPostList,
        retry: 0,
    })
    return query
}
