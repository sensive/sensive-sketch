import { Settings } from 'sketch'
import { setStatusPanelWithCurrentDocument } from './actions.js'
import { closeStatusPanel } from './setup.js'

export const PANEL_VISIBLE = 'panelVisible'

export function togglePanel() {
  if (Settings.settingForKey(PANEL_VISIBLE)) {
    Settings.setSettingForKey(PANEL_VISIBLE, false)
    closeStatusPanel()
  } else {
    Settings.setSettingForKey(PANEL_VISIBLE, true)
    setStatusPanelWithCurrentDocument()
  }
}
