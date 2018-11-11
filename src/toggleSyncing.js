const Settings = require('sketch/settings')
import { requireToken } from './setup.js'
import { exportImage, uploadImage } from './utils.js'

export function toggleSyncing(context) {
  const { document } = context
  const tracking = Settings.documentSettingForKey(document, 'trackDocument')

  const toggle = () => {
    Settings.setDocumentSettingForKey(document, 'trackDocument', !tracking)
    document.showMessage(`${tracking ? 'Stopped' : 'Started'} syncing changes for ${document.cloudName()}`)

    if (!tracking) {
      document.pages().forEach((page) => {
        page.artboards().forEach((artboard) => {
          if (artboard.class() != 'MSSymbolMaster') {
            exportImage(document, artboard, uploadImage)
          }
        })
      })
    }
  }

  requireToken(() => toggle())
}
