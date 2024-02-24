import {
    Button,
    Card,
    CardBody,
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
    CreateGreenhouseProductFromSharedProductSchema,
    CreateGreenhouseProductFromSharedProductValidationType,
} from "@/features/marketplace/types"
import { useParams } from "react-router-dom"

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
    // createGreenhouseProductFromSharedProduct.mutate({ id: greenhouseId!, data: {price: 100, quantity: 5, product: 1  }})
    //
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

    const submit = () => {
        if (tab === "shared") {
            submitShared()
        }
    }

    const submitShared = () => {
        handleSubmitShared(onSubmitShared)()
    }

    const setTab = (key: Key) => {
        setTabb(key.toString())
    }
    const [tab, setTabb] = useState("shared")

    useEffect(() => {
        if (createGreenhouseProductFromSharedProduct.isSuccess) {
            onClose()
        }
    }, [createGreenhouseProductFromSharedProduct.isSuccess, onClose])

    useEffect(() => {
        resetShared()
    }, [onOpenChange, resetShared])

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
                                        <span>xd</span>
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
                                createGreenhouseProductFromSharedProduct.isPending
                                // || createGreenhouseProductFromCustomProduct.isPending
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
