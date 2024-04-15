import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { SendNewsletterValidationType } from "@/features/newsletter/types"

type SendNewsletterType = {
    title: SendNewsletterValidationType["title"]
    html: string
}

const sendNewsletter = ({ data }: { data: SendNewsletterType }) => {
    return api.post(`/send-newsletter/`, data)
}

export const useSendNewsletter = () => {
    const mutation = useMutation({
        mutationFn: sendNewsletter,
    })
    return mutation
}
