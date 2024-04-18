import { Button, Input } from "@nextui-org/react"
import { ChangeEvent, useRef } from "react"

export const GreenhouseProductCustomFields = ({
    register,
    errors,
    setImage,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    register: any
    errors: any
    setImage: (image: File | null) => void
}) => {
    const imageInputRef = useRef<HTMLInputElement>(null)
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUploadData = e?.target?.files?.[0]
        if (newUploadData) {
            setImage(newUploadData)
        }
    }

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
            {/* <Input */}
            {/*     label="Image" */}
            {/*     {...register("product.image")} */}
            {/*     errorMessage={errors?.image?.message} */}
            {/* /> */}

            <Button
                onPress={() => imageInputRef?.current?.click()}
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
            <Input type="submit" value="Submit" className="hidden" />
        </div>
    )
}
