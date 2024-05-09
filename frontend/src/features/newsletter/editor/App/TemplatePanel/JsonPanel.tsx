// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
import { useMemo } from "react"

import { useDocument } from "../../documents/editor/EditorContext"

import HighlightedCodePanel from "./helper/HighlightedCodePanel"

export default function JsonPanel() {
    const document = useDocument()
    const code = useMemo(() => JSON.stringify(document, null, "  "), [document])
    return <HighlightedCodePanel type="json" value={code} />
}
