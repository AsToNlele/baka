// Author: Alexandr Celakovsky - xcelak00
import { SmallLoading } from "@/components/Loading"
import { useNewsletterPostList } from "@/features/newsletter/hooks/useNewsletterPostList"
import { NewsletterPostType } from "@/utils/types"
import { parseIsoAndFormatDateTime } from "@/utils/utils"
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from "@mui/material"

import { resetDocument } from "../../documents/editor/EditorContext"
import getConfiguration from "../../getConfiguration"

import { setSelectedMainTab } from "../../documents/editor/EditorContext"

export const HistoryPanel = () => {
    const { data, isLoading } = useNewsletterPostList()
    return (
        <div>
            <h1 className="my-4 text-2xl">Newsletter history</h1>

            {isLoading ? (
                <SmallLoading />
            ) : (
                    <div>
                        <Grid container spacing={4}>
                            {data?.map((post) => (
                                <Grid item>
                                    <NewsletterPost
                                        key={post.created_at}
                                        title={post.title}
                                        content={post.content}
                                        created_at={post.created_at}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
            )}
        </div>
    )
}

const NewsletterPost = ({ title, content, created_at }: NewsletterPostType) => {
    const handleClick = () => {
        const c = encodeURIComponent(content)
        const code = `#code/${btoa(c)}`
        location.hash = code
        resetDocument(getConfiguration(code))
        setSelectedMainTab("editor")
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                >
                    {parseIsoAndFormatDateTime(created_at ?? "")}
                </Typography>
            </CardContent>
            <CardActions>
                <div className="flex justify-center">
                    <Button onClick={handleClick}>Load</Button>
                </div>
            </CardActions>
        </Card>
    )
}
