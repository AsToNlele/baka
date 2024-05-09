// Author: Alexandr Celakovsky - xcelak00
import { SmallLoading } from "@/components/Loading"
import { useGallery } from "@/features/newsletter/hooks/useGallery"
import { imageUrl } from "@/utils/utils"
import { Button, ImageList, ImageListItem } from "@mui/material"
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    ModalFooter,
} from "@nextui-org/react"

type GalleryModalProps = {
    isOpen: boolean
    onClose: () => void
    onOpenChange: (isOpen: boolean) => void
    onImageSelect: (image: string) => void
}
export const GalleryModal = ({
    isOpen,
    onClose,
    onImageSelect,
}: GalleryModalProps) => {
    const { data, isLoading } = useGallery()

    if (!data && isLoading) {
        return <SmallLoading />
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            scrollBehavior="inside"
            size="4xl"
            classNames={{
                wrapper: "z-[1400]",
                backdrop: "z-[1300]",
            }}
        >
            <ModalContent>
                <ModalHeader title="Cancel Order" />
                <ModalBody>
                    <>
                        {data && (
                            <div className="m-4">
                                <ImageList variant="masonry" cols={3} gap={8}>
                                    {data.map((item) => (
                                        <ImageListItem key={item.image}>
                                            <img
                                                srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${imageUrl(item.image)}?w=248&fit=crop&auto=format`}
                                                alt={item.image}
                                                loading="lazy"
                                                onClick={() =>
                                                    onImageSelect(
                                                        item.image ?? "",
                                                    )
                                                }
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </div>
                        )}
                    </>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
