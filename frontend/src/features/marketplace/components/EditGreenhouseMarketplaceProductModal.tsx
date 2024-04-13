import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    Input,
    Checkbox,
} from "@nextui-org/react"
import {
    EditGreenhouseMarketplaceProductRequestSchema,
    EditGreenhouseMarketplaceProductRequestValidationType,
} from "@/features/marketplace/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useEditGreenhouseMarketplaceProduct } from "@/features/marketplace/hooks/useEditGreenhouseMarketplaceProduct"
import { GreenhouseProductListResponse } from "@/utils/types"
import { useEffect } from "react"
import { useDeleteGreenhouseMarketplaceProduct } from "@/features/marketplace/hooks/useDeleteGreenhouseMarketplaceProduct"

type EditGreenhouseMarketplaceProductModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    marketplaceProductId: number | null
    products: GreenhouseProductListResponse
}

export const EditGreenhouseMarketplaceProductModal = ({
    isOpen,
    onOpenChange,
    onClose,
    marketplaceProductId,
    products = [],
}: EditGreenhouseMarketplaceProductModalProps) => {
    const { mutate } = useEditGreenhouseMarketplaceProduct()
    const { mutate: deleteProduct } = useDeleteGreenhouseMarketplaceProduct()

    const foundProduct = products.find(
        (product) => product.id === marketplaceProductId,
    )

    const convertedProduct = {
        product: {
            name: foundProduct?.product.name ?? "",
            description: foundProduct?.product.description ?? "",
            image: foundProduct?.product.image ?? "",
            shared: foundProduct?.product.shared ?? false,
        },
        quantity: foundProduct?.quantity,
        price: foundProduct?.price,
    }

    const { register, handleSubmit, reset, formState, control } =
        useForm<EditGreenhouseMarketplaceProductRequestValidationType>({
            resolver: zodResolver(
                EditGreenhouseMarketplaceProductRequestSchema,
            ),
            defaultValues: convertedProduct,
        })

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    const onSubmit: SubmitHandler<
        EditGreenhouseMarketplaceProductRequestValidationType
    > = (data) => {
        mutate(
            { id: marketplaceProductId ?? 0, data },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

    useEffect(() => {
        reset(convertedProduct)
    }, [onOpenChange, reset])

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            size="5xl"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Edit Inventory
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {convertedProduct && (
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Name"
                                        {...register("product.name")}
                                        errorMessage={
                                            formState.errors.product?.name
                                                ?.message
                                        }
                                        defaultValue={
                                            convertedProduct.product.name
                                        }
                                    />
                                    <Input
                                        label="Description"
                                        {...register("product.description")}
                                        errorMessage={
                                            formState.errors.product
                                                ?.description?.message
                                        }
                                        defaultValue={
                                            convertedProduct.product.description
                                        }
                                    />
                                    <Input
                                        label="Image"
                                        {...register("product.image")}
                                        errorMessage={
                                            formState.errors.product?.image
                                                ?.message
                                        }
                                        defaultValue={
                                            convertedProduct.product.image
                                        }
                                    />
                                    <Controller
                                        name="product.shared"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                isSelected={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                Shared
                                            </Checkbox>
                                        )}
                                    />

                                    <Input
                                        type="number"
                                        label="Quantity"
                                        {...register("quantity")}
                                        errorMessage={
                                            formState.errors.quantity?.message
                                        }
                                        defaultValue={convertedProduct.quantity?.toString()}
                                    />
                                    <Input
                                        type="number"
                                        label="Price"
                                        {...register("price")}
                                        errorMessage={
                                            formState.errors.price?.message
                                        }
                                        defaultValue={convertedProduct.price}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex justify-end gap-8">
                        <Button variant="flat" color="primary" onPress={submit}>
                            Save
                        </Button>
                        <Button
                            variant="flat"
                            color="danger"
                            onPress={() =>
                                deleteProduct(
                                    { id: marketplaceProductId! },
                                    { onSuccess: onClose },
                                )
                            }
                        >
                            Delete
                        </Button>
                        <Button
                            variant="flat"
                            color="default"
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
