import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

type PageTitleProps = {
    title: string
    hideBackButton?: boolean
}

export const PageTitle = ({ title, hideBackButton = false }: PageTitleProps) => {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                {!hideBackButton && (
                    <button
                        className="flex items-center justify-center w-8 h-8 mr-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft className="w-4 h-4" />
                    </button>
                )}
                <h2 className="text-3xl font-semibold">{title}</h2>
            </div>
        </div>
    )
}
