// Author: Alexandr Celakovsky - xcelak00
import { PageTitle } from "@/features/app/components/PageTitle"
import Editor from "@/features/newsletter/editor/App"
import THEME from "@/features/newsletter/editor/theme"
import { CssBaseline, ThemeProvider } from "@mui/material"

export const Newsletter = () => {
    return (
        <div>
            <PageTitle title="Newsletter" />
            <ThemeProvider theme={THEME}>
                <CssBaseline />
                <Editor />
            </ThemeProvider>
        </div>
    )
}

export default Newsletter
