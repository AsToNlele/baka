// Author: Alexandr Celakovsky - xcelak00
import { AddressFieldsCreate } from "@/features/greenhouses/components/AddressFields"
import { BusinessHours } from "@/features/greenhouses/components/BusinessHours"
import { useCreateGreenhouse } from "@/features/greenhouses/hooks/useCreateGreenhouse"
import {
    CreateGreenhouseSchema,
    CreateGreenhouseValidationType,
} from "@/features/greenhouses/types"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useNavigate } from "react-router-dom"

type CreateGreenhouseModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

export const CreateGreenhouseModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: CreateGreenhouseModalProps) => {
    const navigate = useNavigate()
    const createGreenhouse = useCreateGreenhouse()

    const { register, control, handleSubmit, reset, formState } =
        useForm<CreateGreenhouseValidationType>({
            resolver: zodResolver(CreateGreenhouseSchema),
            defaultValues: {
                greenhouse_business_hours: [],
            },
        })

    const onSubmit: SubmitHandler<CreateGreenhouseValidationType> = (data) => {
        createGreenhouse.mutate(
            { data: data },
            {
                onSuccess: (res) => {
                    navigate(`/app/greenhouses/${res.data.id}`)
                },
            },
        )
    }

    useEffect(() => {
        reset()
    }, [onOpenChange, reset])

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
                        Create Greenhouse
                    </ModalHeader>
                    <ModalBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                submit()
                            }}
                        >
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Title"
                                        placeholder="Name of the greenhouse"
                                        {...register("title", {
                                            required: true,
                                        })}
                                        errorMessage={
                                            formState?.errors?.title?.message
                                        }
                                    />
                                    <Input
                                        label="Description"
                                        placeholder="Some interesting description"
                                        {...register("description")}
                                        errorMessage={
                                            formState?.errors?.description
                                                ?.message
                                        }
                                    />
                                    <Controller
                                        control={control}
                                        name="published"
                                        defaultValue={false}
                                        render={({ field: { onChange } }) => (
                                            <Switch
                                                onChange={onChange}
                                                defaultSelected={false}
                                            >
                                                Public
                                            </Switch>
                                        )}
                                    />
                                </div>
                                <div className="mt-8 flex flex-col gap-2">
                                    <h2 className="text-base">Address</h2>
                                    <AddressFieldsCreate register={register} />
                                </div>
                                <div className="mt-8 flex flex-col gap-2">
                                    <h2 className="text-base">Opening hours</h2>
                                    <Controller
                                        name="greenhouse_business_hours"
                                        control={control}
                                        defaultValue={[]}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <BusinessHours
                                                onChange={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    <Input
                                        variant="flat"
                                        color="secondary"
                                        type="submit"
                                        value="Submit"
                                        hidden
                                        className="hidden"
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
                            isDisabled={createGreenhouse.isPending}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
