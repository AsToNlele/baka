// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
import { Stack, useTheme } from "@mui/material"

import {
  useInspectorDrawerOpen,
  useSamplesDrawerOpen,
} from "../documents/editor/EditorContext"

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from "./InspectorDrawer"
import TemplatePanel from "./TemplatePanel"

function useDrawerTransition(
  cssProperty: "margin-left" | "margin-right",
  open: boolean,
) {
  const { transitions } = useTheme()
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open
      ? transitions.duration.leavingScreen
      : transitions.duration.enteringScreen,
  })
}

export default function App() {
  const inspectorDrawerOpen = useInspectorDrawerOpen()
  const samplesDrawerOpen = useSamplesDrawerOpen()

  const marginLeftTransition = useDrawerTransition(
    "margin-left",
    samplesDrawerOpen,
  )
  const marginRightTransition = useDrawerTransition(
    "margin-right",
    inspectorDrawerOpen,
  )

  return (
    <div className="relative">
      <InspectorDrawer />

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen
            ? `${INSPECTOR_DRAWER_WIDTH}px`
            : 0,
          transition: [
            marginLeftTransition,
            marginRightTransition,
          ].join(", "),
        }}
      >
        <TemplatePanel />
      </Stack>
    </div>
  )
}
