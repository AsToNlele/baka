import { useSharedProductList } from "@/features/marketplace/hooks/useSharedProductList"
import { Input, Select, SelectItem } from "@nextui-org/react"
import { Controller } from "react-hook-form"

export const GreenhouseProductSharedFields = ({
    register,
    errors,
    control,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    register: any
    errors: any
    control: any
}) => {
    const {
        data: sharedProducts,
        isLoading,
        isSuccess,
    } = useSharedProductList()
    return (
        <div className="flex flex-col gap-4">
            {isLoading || !isSuccess || sharedProducts === undefined ? (
                <Select
                    label="Product"
                    disabled
                    errorMessage={errors.product?.message}
                >
                    <SelectItem key="loading">Loading...</SelectItem>
                </Select>
            ) : (
                <Controller
                    control={control}
                    name="product"
                    render={({ field: { onChange } }) => (
                        <Select
                            items={sharedProducts || []}
                            label="Product"
                            onChange={onChange}
                            errorMessage={errors.product?.message}
                        >
                            {sharedProducts?.map(
                                (sharedProduct) =>
                                    sharedProduct && (
                                        <SelectItem
                                            key={sharedProduct.id!}
                                            value={sharedProduct.id!}
                                        >
                                            {sharedProduct.name}
                                        </SelectItem>
                                    ),
                            )}
                        </Select>
                    )}
                />
            )}

            <Input
                type="number"
                label="Price"
                {...register("price")}
                errorMessage={errors.price?.message}
            />
            <Input
                type="number"
                label="Quantity"
                {...register("quantity")}
                errorMessage={errors.quantity?.message}
            />
            <Input type="submit" value="Submit" className="hidden" />
        </div>
    )
}
