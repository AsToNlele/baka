import axios from "axios"
import Cookies from "js-cookie"

export const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

api.interceptors.request.use((config) => {
    const csrftoken = Cookies.get("csrftoken")
    if (csrftoken) {
        config.headers["X-CSRFTOKEN"] = csrftoken
    }
    return config
})
