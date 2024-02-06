import { Input } from "@nextui-org/react"

export const AddressFields = ({
    register,
    data,
}: {
    register: any
    data: any
}) => {
    return (
        <>
            <Input
                label="Country"
                placeholder="Country"
                {...register("greenhouse_address.country")}
                defaultValue={data?.greenhouse_address.country ?? ""}
            />
            <Input
                label="City"
                placeholder="City"
                {...register("greenhouse_address.city")}
                defaultValue={data?.greenhouse_address.city ?? ""}
            />
            <Input
                label="City part"
                placeholder="City part"
                {...register("greenhouse_address.city_part")}
                defaultValue={data?.greenhouse_address.city_part ?? ""}
            />
            <Input
                label="Street"
                placeholder="Street"
                {...register("greenhouse_address.street")}
                defaultValue={data?.greenhouse_address.street ?? ""}
            />
            <Input
                type="number"
                label="Zipcode"
                placeholder="Zipcode"
                {...register("greenhouse_address.zipcode")}
                defaultValue={data?.greenhouse_address.zipcode ?? ""}
            /> <Input
                label="Latitude"
                placeholder="Latitude"
                {...register("greenhouse_address.latitude")}
                defaultValue={data?.greenhouse_address.latitude ?? ""}
            />
            <Input
                label="Longitude"
                placeholder="Longitude"
                {...register("greenhouse_address.longitude")}
                defaultValue={data?.greenhouse_address.longitude ?? ""}
            />
        </>
    )
}
