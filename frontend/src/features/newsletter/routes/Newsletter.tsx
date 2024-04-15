import Editor from "@/features/newsletter/editor/App"
import THEME from "@/features/newsletter/editor/theme"
import { CssBaseline, ThemeProvider } from "@mui/material"

export const Newsletter = () => {
    return (
        <div>
            <ThemeProvider theme={THEME}>
                <CssBaseline />
                <Editor />
            </ThemeProvider>
        </div>
    )
}

export default Newsletter
