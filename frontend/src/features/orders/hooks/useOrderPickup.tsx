// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GetPickupLocationsType } from "utils/types"

const orderPickup = async (id: number) => {
    return api
        .get(`/orders/${id}/get_pickup`)
        .then((res) => res.data as GetPickupLocationsType[])
}

export const useOrderPickup = (id: number | null) => {
    const query = useQuery({
        queryKey: ["OrderPickup", id],
        queryFn: () => orderPickup(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
