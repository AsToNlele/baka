// Author: Alexandr Celakovsky - xcelak00
import { Spinner } from "@nextui-org/react"

export const Loading = () => (
    <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
    </div>
)

export const SmallLoading = () => <Spinner size="lg" />
