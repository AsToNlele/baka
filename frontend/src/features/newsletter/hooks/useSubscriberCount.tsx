// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { SubscriberCountResponse } from "@/utils/types"

const subscriberCount = async () => {
    // Shows subscriber count in newsletter send section
    return api
        .get(`/newsletter/subscriber-count/`)
        .then((res) => res.data as SubscriberCountResponse)
}

export const useSubscriberCount = () => {
    const query = useQuery({
        queryKey: ["subscriberCount"],
        queryFn: subscriberCount,
        retry: 0,
    })
    return query
}
