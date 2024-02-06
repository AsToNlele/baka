import { AddressFields } from "@/features/greenhouses/components/AddressFields"
import { BusinessHours } from "@/features/greenhouses/components/BusinessHours"
import { useEditGreenhouse } from "@/features/greenhouses/hooks/useEditGreenhouse"
import { useGreenhouseDetail } from "@/features/greenhouses/hooks/useGreenhouseDetail"
import { BusinessHoursType, GreenhouseAddressType } from "@/utils/types"
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
} from "@nextui-org/react"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"

type EditGreenhouseModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

export const EditGreenhouseModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: EditGreenhouseModalProps) => {
    const { id } = useParams()

    const greenhouseId = id ? parseInt(id) : null
    const { data } = useGreenhouseDetail(greenhouseId)
    const editGreenhouse = useEditGreenhouse()

    if (!greenhouseId) return null

    type EditGreenhouseInputs = {
        title: string
        description: string
        published: boolean
        greenhouse_address: GreenhouseAddressType
        greenhouse_business_hours: Array<BusinessHoursType>
    }

    const { register, handleSubmit, reset, control, getValues } =
        useForm<EditGreenhouseInputs>({
            defaultValues: {
                title: data?.title ?? "",
                description: data?.description ?? "",
                published: data?.published ?? false,
                greenhouse_address: data?.greenhouse_address ?? {
                    country: "CZ",
                    state: null,
                    city: "",
                    city_part: "",
                    street: "",
                    zipcode: "",
                    latitude: "0",
                    longitude: "0",
                },
                greenhouse_business_hours:
                    data?.greenhouse_business_hours ?? [],
                // caretaker: data?.caretaker ?? null,
            },
        })

    console.log(getValues())

    useEffect(() => {
        // Update data on form submit
        if (data) {
            console.log("RESET")
            reset({
                title: data.title!,
                description: data.description!,
                published: data.published,
                greenhouse_address: data.greenhouse_address,
                greenhouse_business_hours: data.greenhouse_business_hours,
                // caretaker: data.caretaker,
            })
        }
    }, [data, reset])

    const onSubmit: SubmitHandler<EditGreenhouseInputs> = (data) => {
        editGreenhouse.mutate({ id: greenhouseId, data: data })
    }

    const submit = () => {
        handleSubmit(onSubmit)()
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
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Edit Greenhouse
                    </ModalHeader>
                    <ModalBody>
                        <form>
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Title"
                                        placeholder="Name of the greenhouse"
                                        {...register("title", {
                                            required: true,
                                        })}
                                        defaultValue={data?.title ?? ""}
                                    />
                                    <Input
                                        label="Description"
                                        placeholder="Some interesting description"
                                        {...register("description")}
                                        defaultValue={data?.description ?? ""}
                                    />
                                    <Controller
                                        control={control}
                                        name="published"
                                        render={({ field: { onChange } }) => (
                                            <Switch
                                                onChange={onChange}
                                                defaultSelected={
                                                    data?.published
                                                }
                                            >
                                                Public
                                            </Switch>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col mt-8 gap-2">
                                    <h2 className="text-md">Address</h2>
                                    <AddressFields
                                        register={register}
                                        data={data}
                                    />
                                </div>
                                <div className="flex flex-col mt-8 gap-2">
                                    <h2 className="text-md">Opening hours</h2>
                                    <Controller
                                        name="greenhouse_business_hours"
                                        control={control}
                                        defaultValue={
                                            data?.greenhouse_business_hours
                                        }
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <BusinessHours
                                                onChange={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                        <Button
                            color="primary"
                            onPress={submit}
                            isDisabled={editGreenhouse.isPending}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}

