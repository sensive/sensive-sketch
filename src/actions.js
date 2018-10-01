const Settings = require('sketch/settings')
import exportImage from './exportImage.js'
import uploadImage from './uploadImage.js'
import { setup } from './setup.js'

const trackingEnabled = (document) => Settings.documentSettingForKey(document, 'trackDocument') === true

export function onDocumentSaved(context) {
  const { document } = context.actionContext
  const currentArtboard = document.findCurrentArtboardGroup()

  if (trackingEnabled(document) && currentArtboard){
    exportImage(document, currentArtboard, uploadImage)
  }
}
      
export function onArtboardChanged(context) {
  const { document, oldArtboard, newArtboard } = context.actionContext
  const artboardChanged = () => oldArtboard != newArtboard

  if (trackingEnabled(document) && artboardChanged()){
    exportImage(document, oldArtboard, uploadImage)
  }
}
      
export function onOpenDocument() {
  if (!Settings.settingForKey('userApplicationToken')){
    setup()
  }
}
