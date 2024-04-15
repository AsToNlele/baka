import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { SendNewsletterValidationType } from "@/features/newsletter/types"

type SendNewsletterType = {
    title: SendNewsletterValidationType["title"]
    html: string
    json: string
}

const sendNewsletter = ({ data }: { data: SendNewsletterType }) => {
    return api.post(`/newsletter/send-newsletter/`, data)
}

export const useSendNewsletter = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: sendNewsletter,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["newsletterPostList"],
            })
        },
    })
    return mutation
}
