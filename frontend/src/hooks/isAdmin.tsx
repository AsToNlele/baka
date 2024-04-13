import { useProfile } from "@/features/auth/hooks/useProfile"

export const useIsAdmin = () => {
    const { data } = useProfile()
    return data?.superuser
}
