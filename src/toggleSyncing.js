import { Settings } from 'sketch'
import { requireToken } from './setup.js'
import { syncArtboards } from './sync'
import { artboardsFromDocument, notify } from './utils'

const TRACK_DOCUMENT = 'trackDocument'

export function trackingEnabledForDocument(document) {
  return Settings.documentSettingForKey(document, TRACK_DOCUMENT)
}

export function requireTrackingEnabled(document, callback) {
  if (trackingEnabledForDocument(document)) callback()
}

export function toggleSyncing(context) {
  const { document } = context

  requireToken(() => {
    Settings.setDocumentSettingForKey(document, TRACK_DOCUMENT, !trackingEnabledForDocument(document))
  })

  requireTrackingEnabled(document, () => syncArtboards(artboardsFromDocument(document), document))

  if (!trackingEnabledForDocument(document)) {
    notify(document, `Stopped syncing changes for ${document.cloudName()}`)
  }
}
