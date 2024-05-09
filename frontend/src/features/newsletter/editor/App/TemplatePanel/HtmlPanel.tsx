// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
import { useMemo } from "react"

import { renderToStaticMarkup } from "@usewaypoint/email-builder"

import { useDocument } from "../../documents/editor/EditorContext"

import HighlightedCodePanel from "./helper/HighlightedCodePanel"

export default function HtmlPanel() {
    const document = useDocument()
    const code = useMemo(
        () => renderToStaticMarkup(document, { rootBlockId: "root" }),
        [document],
    )
    return <HighlightedCodePanel type="html" value={code} />
}
