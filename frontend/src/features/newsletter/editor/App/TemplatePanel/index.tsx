// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
//
// Edited by: Alexandr Celakovsky - xcelak00
import { MonitorOutlined, PhoneIphoneOutlined } from "@mui/icons-material"
import {
    Box,
    Stack,
    SxProps,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from "@mui/material"
import { Reader } from "@usewaypoint/email-builder"

import EditorBlock from "../../documents/editor/EditorBlock"
import {
    setSelectedScreenSize,
    useDocument,
    useSelectedMainTab,
    useSelectedScreenSize,
} from "../../documents/editor/EditorContext"
import ToggleInspectorPanelButton from "../InspectorDrawer/ToggleInspectorPanelButton"

import HtmlPanel from "./HtmlPanel"
import JsonPanel from "./JsonPanel"
import MainTabsGroup from "./MainTabsGroup"
import ShareButton from "./ShareButton"
import SendPanel from "@/features/newsletter/editor/App/TemplatePanel/SendPanel"
import { GalleryPanel } from "@/features/newsletter/editor/App/TemplatePanel/GalleryPanel"
import { HistoryPanel } from "@/features/newsletter/editor/App/TemplatePanel/HistoryPanel"

export default function TemplatePanel() {
    const document = useDocument()
    const selectedMainTab = useSelectedMainTab()
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

    const handleScreenSizeChange = (_: unknown, value: unknown) => {
        switch (value) {
            case "mobile":
            case "desktop":
                setSelectedScreenSize(value)
                return
            default:
                setSelectedScreenSize("desktop")
        }
    }

    const renderMainPanel = () => {
        switch (selectedMainTab) {
            case "editor":
                return (
                    <Box sx={mainBoxSx}>
                        <EditorBlock id="root" />
                    </Box>
                )
            case "preview":
                return (
                    <Box sx={mainBoxSx}>
                        <Reader document={document} rootBlockId="root" />
                    </Box>
                )
            case "html":
                return (
                    <Box>
                        <HtmlPanel />
                    </Box>
                )
            case "json":
                return <JsonPanel />
            case "send":
                return <SendPanel />
            case "gallery":
                return <GalleryPanel />
            case "history":
                return <HistoryPanel />
        }
    }

    return (
        <>
            <Stack
                sx={{
                    height: 49,
                    borderBottom: 1,
                    borderColor: "divider",
                    backgroundColor: "white",
                    position: "sticky",
                    top: 0,
                    zIndex: "appBar",
                    px: 1,
                }}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack
                    px={2}
                    direction="row"
                    gap={2}
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <MainTabsGroup />
                    <Stack direction="row" spacing={2}>
                        <ToggleButtonGroup
                            value={selectedScreenSize}
                            exclusive
                            size="small"
                            onChange={handleScreenSizeChange}
                        >
                            <ToggleButton value="desktop">
                                <Tooltip title="Desktop view">
                                    <MonitorOutlined fontSize="small" />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="mobile">
                                <Tooltip title="Mobile view">
                                    <PhoneIphoneOutlined fontSize="small" />
                                </Tooltip>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <ShareButton />
                    </Stack>
                </Stack>
                <ToggleInspectorPanelButton />
            </Stack>
            <Box
                sx={{
                    height: "calc(100vh - 49px)",
                    overflow: "auto",
                    minWidth: 370,
                }}
            >
                {renderMainPanel()}
            </Box>
        </>
    )
}
