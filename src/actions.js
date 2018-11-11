const Settings = require('sketch/settings')
import { exportImage, uploadImage } from './utils.js'
import { setup } from './setup.js'

export function onDocumentSaved(context) {
  const { document } = context.actionContext
  const tracking = Settings.documentSettingForKey(document, 'trackDocument')

  if (tracking) {
    document.pages().forEach((page) => {
      page.artboards().forEach((artboard) => {
        if (artboard.class() != 'MSSymbolMaster') {
          exportImage(document, artboard, uploadImage)
        }
      })
    })
  }
}
      
export function onOpenDocument() {
  if (!Settings.settingForKey('userApplicationToken')){
    setup()
  }
}
