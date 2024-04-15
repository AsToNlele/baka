import { useEffect, useMemo } from "react"

import { renderToStaticMarkup } from "@usewaypoint/email-builder"

import { useDocument } from "../../documents/editor/EditorContext"

import { Button, Input } from "@nextui-org/react"
import {
    SendNewsletterSchema,
    SendNewsletterValidationType,
} from "@/features/newsletter/types"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSendNewsletter } from "@/features/newsletter/hooks/useSendNewsletter"
import { toast } from "sonner"

export default function SendPanel() {
    const document = useDocument()
    const code = useMemo(
        () => renderToStaticMarkup(document, { rootBlockId: "root" }),
        [document],
    )

    const { mutate, isPending } = useSendNewsletter()

    const { register, handleSubmit, reset, formState, getValues } =
        useForm<SendNewsletterValidationType>({
            resolver: zodResolver(SendNewsletterSchema),
        })

    const onSubmit: SubmitHandler<SendNewsletterValidationType> = (data) => {
        console.log("mutating")
        console.log(data)
        mutate(
            { data: { title: data.title, html: code } },
            {
                onSuccess: () => {
                    toast.success("Newsletter sent successfully")
                },
            },
        )
    }

    console.log(formState.errors)
    console.log(getValues())

    const submit = () => {
        console.log("SUBMITTING")
        handleSubmit(onSubmit)()
    }

    console.log(document)
    console.log(code)
    useEffect(() => {
        reset()
    }, [])

    return (
        <>
            <h1 className="my-4 text-2xl">Send Newsletter</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-start gap-4">
                    <Input
                        {...register("title")}
                        label="Title"
                        errorMessage={formState?.errors?.title?.message}
                    />
                    <Button onClick={submit} isLoading={isPending}>
                        Send
                    </Button>
                </div>
            </form>
        </>
    )
}
