const Settings = require('sketch/settings')
import { requireToken } from './setup.js'

export function toggleSyncing(context) {
  const { document } = context
  const tracking = Settings.documentSettingForKey(context.document, 'trackDocument')

  const toggle = () => {
    Settings.setDocumentSettingForKey(document, 'trackDocument', !tracking)
    document.showMessage(`${tracking ? 'Stopped' : 'Started'} syncing changes for ${document.cloudName()}`)
  }

  requireToken(() => toggle())
}
