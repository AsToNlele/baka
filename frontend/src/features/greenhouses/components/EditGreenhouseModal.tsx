import { useEditGreenhouse } from "@/features/greenhouses/hooks/useEditGreenhouse"
import { useGreenhouseDetail } from "@/features/greenhouses/hooks/useGreenhouseDetail"
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

    // type GreenhouseAddress = Omit<GreenhouseType["greenhouse_address"], "id">

    type EditGreenhouseInputs = {
        title: string
        description: string
        published: boolean
        // greenhouseAddress: GreenhouseAddress
        // caretaker: GreenhouseType["caretaker"]
    }

    const { register, handleSubmit, reset, control } =
        useForm<EditGreenhouseInputs>({
            defaultValues: {
                title: data?.title ?? "",
                description: data?.description ?? "",
                published: data?.published ?? false,
                // greenhouseAddress: data?.greenhouse_address ?? {
                //     country: "CZ",
                //     state: null,
                //     city: "",
                //     city_part: "",
                //     street: "",
                //     zipcode: "",
                //     latitude: "0",
                //     longitude: "0",
                // },
                // caretaker: data?.caretaker ?? null,
            },
        })

    useEffect(() => {
        // Update data on form submit
        if (data) {
            console.log("RESET")
            reset({
                title: data.title!,
                description: data.description!,
                published: data.published,
                // greenhouseAddress: data.greenhouse_address,
                // caretaker: data.caretaker,
            })
        }
    }, [data, reset])

    const onSubmit: SubmitHandler<EditGreenhouseInputs> = (data) => {
        console.log(data)
        editGreenhouse.mutate({ id: greenhouseId, data: data })
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
                            <div className="flex">
                                <div className="flex-1 flex flex-col gap-4">
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
                                <div className="flex-1"></div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            color="primary"
                            onClick={handleSubmit((d) => onSubmit(d))}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
