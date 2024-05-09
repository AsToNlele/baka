import { ChangeEvent, useState } from "react"

import {
    VerticalAlignBottomOutlined,
    VerticalAlignCenterOutlined,
    VerticalAlignTopOutlined,
} from "@mui/icons-material"
import { Button, Stack, ToggleButton } from "@mui/material"
import { ImageProps, ImagePropsSchema } from "@usewaypoint/block-image"

import BaseSidebarPanel from "./helpers/BaseSidebarPanel"
import RadioGroupInput from "./helpers/inputs/RadioGroupInput"
import TextDimensionInput from "./helpers/inputs/TextDimensionInput"
import TextInput from "./helpers/inputs/TextInput"
import MultiStylePropertyPanel from "./helpers/style-inputs/MultiStylePropertyPanel"
import { useUploadNewsletterImage } from "@/features/newsletter/hooks/useUploadNewsletterImage"
import { imageUrl } from "@/utils/utils"
import { useDisclosure } from "@nextui-org/react"
import { GalleryModal } from "@/features/newsletter/components/GalleryModal"

type ImageSidebarPanelProps = {
    data: ImageProps
    setData: (v: ImageProps) => void
}
export default function ImageSidebarPanel({
    data,
    setData,
}: ImageSidebarPanelProps) {
    const [, setErrors] = useState<Zod.ZodError | null>(null)

    const uploadNewsletterImage = useUploadNewsletterImage()

    const updateData = (d: unknown) => {
        const res = ImagePropsSchema.safeParse(d)
        if (res.success) {
            setData(res.data)
            setErrors(null)
        } else {
            setErrors(res.error)
        }
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUploadData = e?.target?.files?.[0]
        if (newUploadData) {
            uploadNewsletterImage.mutate(
                { data: { image: newUploadData } },
                {
                    onSuccess: (res) => {
                        const url = imageUrl(res.data.image)
                        updateData({
                            ...data,
                            props: { ...data.props, url: url },
                        })
                    },
                },
            )
        }
    }

    const handleImageSelect = (image: string) => {
        updateData({ ...data, props: { ...data.props, url: imageUrl(image) } })
        onClose()
    }

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <BaseSidebarPanel title="Image block">
            <div className="mt-4 flex flex-wrap gap-2">
                <Button
                    variant="contained"
                    component="label"
                    size="large"
                    disabled={uploadNewsletterImage.isPending}
                >
                    Upload File
                    <input
                        type="file"
                        hidden
                        name="image"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => {
                            handleImageChange(e)
                        }}
                    />
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color="success"
                    onClick={onOpen}
                >
                    From Gallery
                </Button>
                <GalleryModal
                    onOpenChange={onOpenChange}
                    isOpen={isOpen}
                    onClose={onClose}
                    onImageSelect={handleImageSelect}
                />
            </div>
            <TextInput
                label="Source URL"
                defaultValue={data.props?.url ?? ""}
                onChange={(v) => {
                    const url = v.trim().length === 0 ? null : v.trim()
                    updateData({ ...data, props: { ...data.props, url } })
                }}
            />

            <TextInput
                label="Alt text"
                defaultValue={data.props?.alt ?? ""}
                onChange={(alt) =>
                    updateData({ ...data, props: { ...data.props, alt } })
                }
            />
            <TextInput
                label="Click through URL"
                defaultValue={data.props?.linkHref ?? ""}
                onChange={(v) => {
                    const linkHref = v.trim().length === 0 ? null : v.trim()
                    updateData({ ...data, props: { ...data.props, linkHref } })
                }}
            />
            <Stack direction="row" spacing={2}>
                <TextDimensionInput
                    label="Width"
                    defaultValue={data.props?.width}
                    onChange={(width) =>
                        updateData({ ...data, props: { ...data.props, width } })
                    }
                />
                <TextDimensionInput
                    label="Height"
                    defaultValue={data.props?.height}
                    onChange={(height) =>
                        updateData({
                            ...data,
                            props: { ...data.props, height },
                        })
                    }
                />
            </Stack>

            <RadioGroupInput
                label="Alignment"
                defaultValue={data.props?.contentAlignment ?? "middle"}
                onChange={(contentAlignment) =>
                    updateData({
                        ...data,
                        props: { ...data.props, contentAlignment },
                    })
                }
            >
                <ToggleButton value="top">
                    <VerticalAlignTopOutlined fontSize="small" />
                </ToggleButton>
                <ToggleButton value="middle">
                    <VerticalAlignCenterOutlined fontSize="small" />
                </ToggleButton>
                <ToggleButton value="bottom">
                    <VerticalAlignBottomOutlined fontSize="small" />
                </ToggleButton>
            </RadioGroupInput>

            <MultiStylePropertyPanel
                names={["backgroundColor", "textAlign", "padding"]}
                value={data.style}
                onChange={(style) => updateData({ ...data, style })}
            />
        </BaseSidebarPanel>
    )
}
