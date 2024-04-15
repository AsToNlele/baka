import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type NewsletterImageType = {
    image: File
}

const uploadNewsletterImage = ({ data }: { data: NewsletterImageType }) => {
    const form_data = new FormData()
    if (data.image) form_data.append("image", data.image, data.image.name)

    return api.post(`/newsletter/gallery/`, form_data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export const useUploadNewsletterImage = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: uploadNewsletterImage,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["galleryList"],
            })
        },
    })
    return mutation
}
