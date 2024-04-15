import { SmallLoading } from "@/components/Loading"
import { useGallery } from "@/features/newsletter/hooks/useGallery"
import { useUploadNewsletterImage } from "@/features/newsletter/hooks/useUploadNewsletterImage"
import { imageUrl } from "@/utils/utils"
import { Button, ImageList, ImageListItem } from "@mui/material"
import { ChangeEvent } from "react"

export const GalleryPanel = () => {
    const { data, isLoading } = useGallery()
    const uploadNewsletterImage = useUploadNewsletterImage()
    const handleImageChange = (e:ChangeEvent<HTMLInputElement>) => {
        const newUploadData = e?.target?.files?.[0]
        if (newUploadData) {
            uploadNewsletterImage.mutate({ data: { image: newUploadData } })
        }
    }

    if (!data && isLoading) {
        return <SmallLoading />
    }

    return (
        <>
            <div className="mt-4 flex justify-center">
                <Button variant="contained" component="label" size="large">
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
            </div>

            {data && (
                <div className="m-4">
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {data.map((item) => (
                            <ImageListItem key={item.image}>
                                <img
                                    srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${imageUrl(item.image)}?w=248&fit=crop&auto=format`}
                                    alt={item.image}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            )}
        </>
    )
}
