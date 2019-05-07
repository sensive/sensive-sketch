import { Settings } from 'sketch'
import * as R from 'rambda'

import { Document } from 'sketch/dom'
import { setup, setStatusPanel } from './setup'
import { syncArtboards } from './sync'
import { requireTrackingEnabled, objectIdentifier } from './utils'

export function onDocumentSaved(context) {
  const { document } = context.actionContext

  requireTrackingEnabled(document, () => {
    const touchedArtboardIds = R.uniq(Settings.sessionVariable('touchedArtboardIds') || [])

    if (!touchedArtboardIds.length) { return }

    touchedArtboardIds.reduce((promise, id) => {
      const artboard = Document.getSelectedDocument().getLayerWithID(id).sketchObject

      return promise.then(() => artboard ? syncArtboards([artboard], document) : '')

    }, Promise.resolve())
  })

  Settings.setSessionVariable('touchedArtboardIds', [])

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
  const { newArtboard } = context.actionContext

  Settings.setSessionVariable('touchedArtboardIds', [
    objectIdentifier(newArtboard),
    ...(Settings.sessionVariable('touchedArtboardIds') || []),
  ])
}
