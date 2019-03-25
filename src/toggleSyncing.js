import { Settings } from 'sketch'
import { requireToken, setStatusPanel } from './setup.js'
import { syncArtboards } from './sync'
import { artboardsFromDocument, notify } from './utils'

const TRACK_DOCUMENT = 'trackDocument'

export function trackingEnabledForDocument(document) {
  return Settings.documentSettingForKey(document, TRACK_DOCUMENT)
}

export function requireTrackingEnabled(document, callback) {
  if (trackingEnabledForDocument(document)) callback()
}

export const toggleSyncing = context => toggleSyncingForDocument(context.document)

export function toggleSyncingForDocument(document) {
  requireToken(() => {
    Settings.setDocumentSettingForKey(document, TRACK_DOCUMENT, !trackingEnabledForDocument(document))
    setStatusPanel(document)
  })

  requireTrackingEnabled(document, () => syncArtboards(artboardsFromDocument(document), document))

  if (!trackingEnabledForDocument(document)) {
    notify(document, `Stopped syncing changes for ${document.cloudName()}`)
  }
}
