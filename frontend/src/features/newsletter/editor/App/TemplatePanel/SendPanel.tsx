import { useEffect, useMemo } from "react"

import { Reader, renderToStaticMarkup } from "@usewaypoint/email-builder"

import {
    useDocument,
    useSelectedScreenSize,
} from "../../documents/editor/EditorContext"

import { Button, Input } from "@nextui-org/react"
import {
    SendNewsletterSchema,
    SendNewsletterValidationType,
} from "@/features/newsletter/types"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSendNewsletter } from "@/features/newsletter/hooks/useSendNewsletter"
import { toast } from "sonner"
import { Box, SxProps } from "@mui/material"
import { useSubscriberCount } from "@/features/newsletter/hooks/useSubscriberCount"
import { SmallLoading } from "@/components/Loading"

export default function SendPanel() {
    const document = useDocument()
    const code = useMemo(
        () => renderToStaticMarkup(document, { rootBlockId: "root" }),
        [document],
    )

    const jsonCode = useMemo(
        () => JSON.stringify(document, null, "  "),
        [document],
    )

    const { data: subscriberCount, isLoading: subscriberCountLoading } =
        useSubscriberCount()

    const selectedScreenSize = useSelectedScreenSize()

    let mainBoxSx: SxProps = {
        height: "100%",
    }
    if (selectedScreenSize === "mobile") {
        mainBoxSx = {
            ...mainBoxSx,
            margin: "32px auto",
            width: 370,
            height: 800,
            boxShadow:
                "rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px",
        }
    }

    const { mutate, isPending } = useSendNewsletter()

    const { register, handleSubmit, reset, formState, getValues } =
        useForm<SendNewsletterValidationType>({
            resolver: zodResolver(SendNewsletterSchema),
        })

    const onSubmit: SubmitHandler<SendNewsletterValidationType> = (data) => {
        console.log("mutating")
        console.log(data)
        mutate(
            { data: { title: data.title, html: code, json:jsonCode } },
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
                <div className="mb-4 flex flex-col items-start justify-start gap-4">
                    <Input
                        {...register("title")}
                        label="Title"
                        errorMessage={formState?.errors?.title?.message}
                        classNames={{
                            base: "w-full md:w-[60%]",
                        }}
                    />
                    {subscriberCountLoading || !subscriberCount ? (
                        <SmallLoading />
                    ) : (
                        <p>
                            {subscriberCount?.subscribers}{" "}
                            {subscriberCount?.subscribers > 1
                                ? "users are "
                                : "user is "}{" "}
                            subscribed to the newsletter
                        </p>
                    )}
                    <Button
                        onPress={submit}
                        isLoading={isPending}
                        color="primary"
                    >
                        Send
                    </Button>
                </div>

                <h2 className="mb-2 mt-8 text-xl">Preview</h2>
                <Box sx={mainBoxSx}>
                    <Reader document={document} rootBlockId="root" />
                </Box>
            </form>
        </>
    )
}
