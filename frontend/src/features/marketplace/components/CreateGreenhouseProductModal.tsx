// Author: Alexandr Celakovsky - xcelak00
import {
    Button,
    Card,
    CardBody,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
} from "@nextui-org/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, Key } from "react"
import { useCreateGreenhouseProductFromSharedProduct } from "@/features/marketplace/hooks/useCreateGreenhouseProductFromSharedProduct"
import { GreenhouseProductSharedFields } from "@/features/marketplace/components/GreenhouseProductSharedFields"
import {
    CreateGreenhouseProductFromCustomProductSchema,
    CreateGreenhouseProductFromCustomProductValidationType,
    CreateGreenhouseProductFromSharedProductSchema,
    CreateGreenhouseProductFromSharedProductValidationType,
} from "@/features/marketplace/types"
import { useParams } from "react-router-dom"
import { useCreateGreenhouseProductFromCustomProduct } from "@/features/marketplace/hooks/useCreateGreenhouseProductFromCustomProduct"
import { GreenhouseProductCustomFields } from "@/features/marketplace/components/GreenhouseProductCustomFields"

type CreateGreenhouseProductModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

export const CreateGreenhouseProductModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: CreateGreenhouseProductModalProps) => {
    const { id } = useParams()
    const greenhouseId = id ? parseInt(id) : null
    const createGreenhouseProductFromSharedProduct =
        useCreateGreenhouseProductFromSharedProduct()

    const [image, setImage] = useState<File | null>(null)

    const {
        register: registerShared,
        handleSubmit: handleSubmitShared,
        reset: resetShared,
        formState: { errors: errorsShared },
        control: controlShared,
    } = useForm<CreateGreenhouseProductFromSharedProductValidationType>({
        resolver: zodResolver(CreateGreenhouseProductFromSharedProductSchema),
    })

    const onSubmitShared: SubmitHandler<
        CreateGreenhouseProductFromSharedProductValidationType
    > = (data) => {
        createGreenhouseProductFromSharedProduct.mutate({
            id: greenhouseId!,
            data: data,
        })
    }

    const submitShared = () => {
        handleSubmitShared(onSubmitShared)()
    }

    const createGreenhouseProductFromCustomProduct =
        useCreateGreenhouseProductFromCustomProduct()

    const {
        register: registerCustom,
        handleSubmit: handleSubmitCustom,
        reset: resetCustom,
        formState: { errors: errorsCustom },
    } = useForm<CreateGreenhouseProductFromCustomProductValidationType>({
        resolver: zodResolver(CreateGreenhouseProductFromCustomProductSchema),
    })

    const onSubmitCustom: SubmitHandler<
        CreateGreenhouseProductFromCustomProductValidationType
    > = (data) => {
        createGreenhouseProductFromCustomProduct.mutate({
            id: greenhouseId!,
            data: {
                ...data,
                product: { ...data.product, image: image ?? null },
            },
        })
    }

    const submitCustom = () => {
        handleSubmitCustom(onSubmitCustom)()
    }

    useEffect(() => {
        if (
            createGreenhouseProductFromSharedProduct.isSuccess ||
            createGreenhouseProductFromCustomProduct.isSuccess
        ) {
            onClose()
        }
    }, [
        createGreenhouseProductFromSharedProduct.isSuccess,
        createGreenhouseProductFromCustomProduct.isSuccess,
        onClose,
    ])

    useEffect(() => {
        resetShared()
        resetCustom()
        setImage(null)
    }, [onOpenChange, resetShared, resetCustom])

    const submit = () => {
        if (tab === "shared") {
            submitShared()
        } else {
            submitCustom()
        }
    }

    const setTab = (key: Key) => {
        setTabb(key.toString())
    }
    const [tab, setTabb] = useState("shared")

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            size="5xl"
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Create a Greenhouse product
                    </ModalHeader>
                    <ModalBody>
                        <Tabs selectedKey={tab} onSelectionChange={setTab}>
                            <Tab key="shared" title="Use an existing product">
                                <Card>
                                    <CardBody>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                submitShared()
                                            }}
                                        >
                                            <GreenhouseProductSharedFields
                                                register={registerShared}
                                                errors={errorsShared}
                                                control={controlShared}
                                            />
                                        </form>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="custom" title="Create a new product">
                                <Card>
                                    <CardBody>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                submitCustom()
                                            }}
                                        >
                                            <GreenhouseProductCustomFields
                                                register={registerCustom}
                                                errors={errorsCustom}
                                                setImage={setImage}
                                            />
                                            {image && (
                                                <Image
                                                    src={
                                                        image
                                                            ? URL.createObjectURL(
                                                                image,
                                                            )
                                                            : ""
                                                    }
                                                    alt="Product"
                                                    width="300"
                                                    height="200"
                                                    className="w-full object-cover"
                                                />
                                            )}
                                        </form>
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                        <Button
                            color="primary"
                            onPress={submit}
                            isDisabled={
                                createGreenhouseProductFromSharedProduct.isPending ||
                                createGreenhouseProductFromCustomProduct.isPending
                            }
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
