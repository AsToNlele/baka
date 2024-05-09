// Author: Alexandr Celakovsky - xcelak00
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    Input,
    Checkbox,
    Image,
} from "@nextui-org/react"
import {
    EditGreenhouseMarketplaceProductRequestSchema,
    EditGreenhouseMarketplaceProductRequestValidationType,
} from "@/features/marketplace/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useEditGreenhouseMarketplaceProduct } from "@/features/marketplace/hooks/useEditGreenhouseMarketplaceProduct"
import { GreenhouseProductListResponse } from "@/utils/types"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDeleteGreenhouseMarketplaceProduct } from "@/features/marketplace/hooks/useDeleteGreenhouseMarketplaceProduct"
import { imageUrl } from "@/utils/utils"
import { useDeleteGreenhouseMarketplaceProductImage } from "@/features/marketplace/hooks/useDeleteGreenhouseMarketplaceProductImage"

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
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File | string | null>(null)

    const foundProduct = products.find(
        (product) => product.id === marketplaceProductId,
    )

    const convertedProduct = {
        product: {
            name: foundProduct?.product.name ?? "",
            description: foundProduct?.product.description ?? "",
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

    const { mutate: removeProductImage } =
        useDeleteGreenhouseMarketplaceProductImage()

    const removeImage = () => {
        removeProductImage({ id: marketplaceProductId! }, { onSuccess: onClose })
    }

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    const onSubmit: SubmitHandler<
        EditGreenhouseMarketplaceProductRequestValidationType
    > = (data) => {
        console.log(image)
        mutate(
            {
                id: marketplaceProductId ?? 0,
                data: {
                    ...data,
                    product: {
                        ...data.product,
                        image: image ?? null,
                    },
                },
            },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUploadData = e?.target?.files?.[0]
        if (newUploadData) {
            setImage(newUploadData)
        }
    }

    useEffect(() => {
        reset(convertedProduct)
        if (foundProduct?.product?.image) {
            setImage(foundProduct?.product?.image)
        } else {
            setImage(null)
        }
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
                                    <div className="flex gap-4">
                                        <Button
                                            onPress={() =>
                                                imageInputRef?.current?.click()
                                            }
                                            color="secondary"
                                            variant="flat"
                                        >
                                            Upload Image
                                            <input
                                                hidden
                                                type="file"
                                                name="image"
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={(e) => {
                                                    handleImageChange(e)
                                                }}
                                                ref={imageInputRef}
                                            />
                                        </Button>
                                        <Button
                                            variant="flat"
                                            color="warning"
                                            onPress={removeImage}
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image
                                            src={
                                                typeof image === "string"
                                                    ? imageUrl(image) ?? ""
                                                    : image
                                                      ? URL.createObjectURL(
                                                            image,
                                                        )
                                                      : ""
                                            }
                                            alt="product image"
                                        />
                                    </div>
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
