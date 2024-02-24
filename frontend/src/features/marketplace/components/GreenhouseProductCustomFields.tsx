import { Input } from "@nextui-org/react"

export const GreenhouseProductCustomFields = ({
    register,
    errors,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    register: any
    errors: any
}) => {
    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Name"
                {...register("product.name")}
                errorMessage={errors?.product?.name?.message}
            />
            <Input
                label="Description"
                {...register("product.description")}
                errorMessage={errors?.product?.description?.message}
            />
            <Input
                label="Image"
                {...register("product.image")}
                errorMessage={errors?.image?.message}
            />
            <Input
                type="number"
                label="Price"
                {...register("price")}
                errorMessage={errors?.price?.message}
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
