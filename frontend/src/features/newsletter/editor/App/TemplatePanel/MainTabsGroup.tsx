// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
// 
// Edited by: Alexandr Celakovsky - xcelak00

import {
    CodeOutlined,
    DataObjectOutlined,
    EditOutlined,
    History,
    ImageSharp,
    MailOutlined,
    PreviewOutlined,
} from "@mui/icons-material"
import { Tab, Tabs, Tooltip } from "@mui/material"

import {
    setSelectedMainTab,
    useSelectedMainTab,
} from "../../documents/editor/EditorContext"

export default function MainTabsGroup() {
    const selectedMainTab = useSelectedMainTab()
    const handleChange = (_: unknown, v: unknown) => {
        switch (v) {
            case "json":
            case "preview":
            case "editor":
            case "html":
            case "send":
            case "gallery":
            case "history":
                setSelectedMainTab(v)
                return
            default:
                setSelectedMainTab("editor")
        }
    }

    return (
        <Tabs value={selectedMainTab} onChange={handleChange}>
            <Tab
                value="editor"
                label={
                    <Tooltip title="Edit">
                        <EditOutlined fontSize="small" />
                    </Tooltip>
                }
            />
            <Tab
                value="preview"
                label={
                    <Tooltip title="Preview">
                        <PreviewOutlined fontSize="small" />
                    </Tooltip>
                }
            />
            <Tab
                value="html"
                label={
                    <Tooltip title="HTML output">
                        <CodeOutlined fontSize="small" />
                    </Tooltip>
                }
            />
            <Tab
                value="json"
                label={
                    <Tooltip title="JSON output">
                        <DataObjectOutlined fontSize="small" />
                    </Tooltip>
                }
            />
            <Tab
                value="send"
                label={
                    <Tooltip title="Send Newsletter">
                        <MailOutlined fontSize="small" />
                    </Tooltip>
                }
            />
            <Tab
                value="gallery"
                label={
                    <Tooltip title="Images">
                        <ImageSharp fontSize="small" />
                    </Tooltip>
                }
            />
            <Tab
                value="history"
                label={
                    <Tooltip title="Newsletter History">
                        <History fontSize="small" />
                    </Tooltip>
                }
            />
        </Tabs>
    )
}
