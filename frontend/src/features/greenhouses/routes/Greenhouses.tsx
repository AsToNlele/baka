// Author: Alexandr Celakovsky - xcelak00
import { Button, useDisclosure } from "@nextui-org/react"
import { Greenhouse } from "../components/Greenhouse"
import { useGreenhouseList } from "../hooks/useGreenhouseList"
import { PageTitle } from "@/features/app/components/PageTitle"
import { FaPlus } from "react-icons/fa"
import { useIsAdmin } from "@/hooks/isAdmin"
import { CreateGreenhouseModal } from "@/features/greenhouses/components/CreateGreenhouseModal"

export const Greenhouses = () => {
    const { data: greenhouses } = useGreenhouseList()
    const isAdmin = useIsAdmin()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    return (
        <>
            <div className="flex gap-2">
                <PageTitle title="Greenhouses" />
                {isAdmin && (
                    <>
                        <Button
                            color="success"
                            variant="flat"
                            isIconOnly
                            onPress={onOpen}
                        >
                            <FaPlus />
                        </Button>
                        <CreateGreenhouseModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            onClose={onClose}
                        />
                    </>
                )}
            </div>
            <div className="flex items-start gap-4">
                <div className="grid grow grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {greenhouses?.map((item, i) => (
                        <Greenhouse item={item} key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}
