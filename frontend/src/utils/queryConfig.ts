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
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error?.response?.data?.detail) {
                    toast.error(error.response.data.detail)
                } else if (error && error?.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else if (
                    error.response?.data &&
                    Object.keys(error.response.data).length > 0
                ) {
                    console.log(
                        error.response.data[
                            Object.keys(error.response.data)[0]
                        ][0]
                    )
                    toast.error(
                        error.response.data[
                            Object.keys(error.response.data)[0]
                        ][0]
                    )
                }
            }
        },
    }),
}
