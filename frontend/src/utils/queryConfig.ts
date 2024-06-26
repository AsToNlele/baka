// Author: Alexandr Celakovsky - xcelak00
import { MutationCache, QueryCache } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

export const queryConfig = {
    queryCache: new QueryCache({
        onError: (error) => {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (!error?.request?.responseURL?.includes("/auth/profile")) {
                    if (error && error?.response?.data?.detail) {
                        toast.error(error.response.data.detail)
                    } else if (error && error?.message) {
                        toast.error(error.message)
                    }
                }
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                if (error?.response?.data?.detail) {
                    toast.error(error.response.data.detail)
                } else if (error && error?.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else if (
                    error.response?.data &&
                    error?.response?.data?.items &&
                    error?.response?.data?.items[0] &&
                    error?.response?.data?.items[0].non_field_errors
                ) {
                    toast.error(
                        error.response.data.items[0].non_field_errors[0],
                    )
                } else if (
                    error.response?.data &&
                    Object.keys(error.response.data).length > 0
                ) {
                    console.log(JSON.stringify(error.response.data))
                    toast.error(JSON.stringify(error.response.data))
                } else {
                    console.log(error)
                }
            } else {
                console.log(error)
            }
        },
    }),
}
