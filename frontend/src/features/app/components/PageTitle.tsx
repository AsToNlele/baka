import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

type PageTitleProps = {
    title: string
    hideBackButton?: boolean
    backPath?: string
}

export const PageTitle = ({
    title,
    hideBackButton = false,
    backPath = "..",
}: PageTitleProps) => {
    const navigate = useNavigate()

    return (
        <div className="flex items-center">
            {!hideBackButton && (
                <button
                    className="mr-2 flex size-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                    onClick={() =>
                        navigate(
                            backPath,
                            backPath === ".." ? { relative: "path" } : {}
                        )
                    }
                >
                    <FaArrowLeft className="size-4" />
                </button>
            )}
            <h2 className="text-3xl font-semibold">{title}</h2>
        </div>
        // </div>
    )
}
