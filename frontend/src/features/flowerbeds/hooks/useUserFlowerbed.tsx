import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { UserFlowerbedType } from "utils/types"

const userFlowerbed = async (id: number) => {
    return api
        .get(`/flowerbeds/${id}/get_current_details/`)
        .then((res) => res.data as UserFlowerbedType)
}

export const useUserFlowerbed = (id: number | null) => {
    const query = useQuery({
        queryKey: ["userFlowerbed", id],
        queryFn: () => userFlowerbed(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
