import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GalleryListResponse } from "@/utils/types"

const gallery = async () => {
    return api
        .get(`/newsletter/gallery/`)
        .then((res) => res.data as GalleryListResponse)
}

export const useGallery = () => {
    const query = useQuery({
        queryKey: ["galleryList"],
        queryFn: gallery,
        retry: 0,
    })
    return query
}
