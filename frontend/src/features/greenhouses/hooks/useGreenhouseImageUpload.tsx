// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type GreenhouseImageUploadType= {
    image: File
    greenhouseId: number | null
}

const greenhouseImageUpload = ({ data }: { data: GreenhouseImageUploadType }) => {
    const form_data = new FormData()
    if (data.image) form_data.append("image", data.image, data.image.name)
    else {
        form_data.append("image", "")
    }
    form_data.append("id", data.greenhouseId?.toString() ?? "")

    return api.put(`/greenhouse-upload/`, form_data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export const useGreenhouseImageUpload = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: greenhouseImageUpload,
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList"],
            })
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList", res.data.id],
            })
        },
    })
    return mutation
}
