import { Settings } from 'sketch'

import { Document } from 'sketch/dom'
import { setup, setStatusPanel } from './setup'
import { syncArtboards } from './sync'
import { requireTrackingEnabled } from './utils'

export function onDocumentSaved(context) {
  const { document } = context.actionContext
  const currentArtboard = document.findCurrentArtboardGroup()

  requireTrackingEnabled(document, () => {
    if (currentArtboard) syncArtboards([currentArtboard], document)
  })

  setStatusPanel(document)
}

export function onStartup() {
  if (!Settings.settingForKey('userApplicationToken')){
    setup()
  }

  setStatusPanelWithCurrentDocument()
}

export function onSelectionChanged() { setStatusPanelWithCurrentDocument() }
export function onOpenDocument() { setStatusPanelWithCurrentDocument() }
export function onCloseDocument() { setStatusPanelWithCurrentDocument() }
export function onToggleInspectorVisibility() { setStatusPanelWithCurrentDocument() }

export function setStatusPanelWithCurrentDocument() {
  const document = Document.getSelectedDocument()
  setStatusPanel(document.sketchObject)
}

export function onArtboardChanged(context) {
  const { document, oldArtboard, newArtboard } = context.actionContext
  const artboardUnchanged = () => oldArtboard === newArtboard

  // TODO: fix error when selecting one artboard at beginning
  console.log(artboardUnchanged())

  requireTrackingEnabled(document, () => {
    if (artboardUnchanged()) return

    syncArtboards([oldArtboard], document)
  })
}
