// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
import { Button } from "@mui/material"

import { resetDocument } from "../../documents/editor/EditorContext"
import getConfiguration from "../../getConfiguration"

export default function SidebarButton({
    href,
    children,
}: {
    href: string
    children: JSX.Element | string
}) {
    const handleClick = () => {
        resetDocument(getConfiguration(href))
    }
    return (
        <Button size="small" href={href} onClick={handleClick}>
            {children}
        </Button>
    )
}
