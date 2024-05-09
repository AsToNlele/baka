// Author: Alexandr Celakovsky - xcelak00
import { useEditGreenhouseProductInventory } from "@/features/marketplace/hooks/useEditGreenhouseProductInventory"
import { GreenhouseProductListResponse } from "@/utils/types"
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table,
    TableColumn,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    ModalContent,
} from "@nextui-org/react"
import { useParams } from "react-router-dom"
import {
    EditGreenhouseProductInventoryRequestSchema,
    EditGreenhouseProductInventoryRequestValidationType,
} from "@/features/marketplace/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

type EditGreenhouseProductInventoryModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    products: GreenhouseProductListResponse
}

export const EditGreenhouseProductInventoryModal = ({
    isOpen,
    onOpenChange,
    onClose,
    products = [],
}: EditGreenhouseProductInventoryModalProps) => {
    const { id } = useParams()
    const greenhouseId = id ? parseInt(id) : null
    const { mutate } = useEditGreenhouseProductInventory()

    const { register, control, handleSubmit } =
        useForm<EditGreenhouseProductInventoryRequestValidationType>({
            resolver: zodResolver(EditGreenhouseProductInventoryRequestSchema),
            defaultValues: {
                products: products?.map((product) => ({
                    id: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
            },
        })


    const submit = () => {
        handleSubmit(onSubmit)()
    }

    const onSubmit: SubmitHandler<
        EditGreenhouseProductInventoryRequestValidationType
    > = (data) => {
        mutate(
            { id: greenhouseId!, data },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

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
                            <Controller
                                name="products"
                                defaultValue={products?.map((product) => ({
                                    id: product.id!,
                                    quantity: product.quantity,
                                    price: product.price,
                                }))}
                                control={control}
                                render={() => (
                                    <div className="flex flex-col gap-4">
                                        <Table
                                            shadow="none"
                                            isStriped
                                            aria-label="Table of products"
                                        >
                                            <TableHeader>
                                                <TableColumn>Name</TableColumn>
                                                <TableColumn>
                                                    Quantity
                                                </TableColumn>
                                                <TableColumn>Price</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {products?.map(
                                                    (product, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {
                                                                    product
                                                                        .product
                                                                        .name
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <input
                                                                    type="number"
                                                                    {...register(
                                                                        `products.${index}.quantity`,
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <input
                                                                    type="number"
                                                                    {...register(
                                                                        `products.${index}.price`,
                                                                    )}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            />
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={submit}>
                        Save
                    </Button>
                    <Button color="secondary" onPress={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
