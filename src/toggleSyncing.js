const Settings = require('sketch/settings')
import { requireToken } from './setup.js'
// import exportImage from './export-image.js'
// import uploadImage from './upload-image.js'

export function toggleSyncing(context) {
  const { document } = context
  const tracking = Settings.documentSettingForKey(context.document, 'trackDocument')

  const toggle = () => {
    Settings.setDocumentSettingForKey(document, 'trackDocument', !tracking)
    document.showMessage(`${tracking ? 'Stopped' : 'Started'} syncing changes for ${document.cloudName()}`)
    
    // if(!tracking){
    //   document.pages().forEach((page) => {
    //     page.artboards().forEach((artboard) => {
    //       exportImage(document, artboard, uploadImage)
    //     })
    //   })
    // }
  }

  requireToken(() => toggle())
}
