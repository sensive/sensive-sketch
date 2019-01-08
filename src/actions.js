import { Settings } from 'sketch'
import { setup } from './setup'
import { syncArtboards } from './sync'
import { requireTrackingEnabled } from './utils'

export function onDocumentSaved(context) {
  const { document } = context.actionContext
  const currentArtboard = document.findCurrentArtboardGroup()

  requireTrackingEnabled(document, () => {
    if (currentArtboard) syncArtboards([currentArtboard], document)
  })
}

export function onStartup() {
  if (!Settings.settingForKey('userApplicationToken')){
    setup()
  }
}

export function onArtboardChanged(context) {
  const { document, oldArtboard, newArtboard } = context.actionContext
  const artboardUnchanged = () => oldArtboard === newArtboard

  console.log(artboardUnchanged()) // why get error when selecting one artboard at beginning

  requireTrackingEnabled(document, () => {
    if (artboardUnchanged()) return

    syncArtboards([oldArtboard], document)
  })
}
