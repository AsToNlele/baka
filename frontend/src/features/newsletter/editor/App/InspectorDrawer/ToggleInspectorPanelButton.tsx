// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
import { AppRegistrationOutlined, LastPageOutlined } from "@mui/icons-material"
import { IconButton } from "@mui/material"

import {
    toggleInspectorDrawerOpen,
    useInspectorDrawerOpen,
} from "../../documents/editor/EditorContext"

export default function ToggleInspectorPanelButton() {
    const inspectorDrawerOpen = useInspectorDrawerOpen()

    const handleClick = () => {
        toggleInspectorDrawerOpen()
    }
    if (inspectorDrawerOpen) {
        return (
            <IconButton onClick={handleClick}>
                <LastPageOutlined fontSize="small" />
            </IconButton>
        )
    }
    return (
        <IconButton onClick={handleClick}>
            <AppRegistrationOutlined fontSize="small" />
        </IconButton>
    )
}
