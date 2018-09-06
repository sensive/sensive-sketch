const fetch = require('sketch-polyfill-fetch')
const Settings = require('sketch/settings')
const exportImage = require('export-image')

const trackingEnabled = (document) => Settings.documentSettingForKey(document, 'trackDocument') === true

const sendSnapshot = (imageURL, artboard) => {
  const { document } = context.actionContext
  
  const artboardName = String(artboard.name())
  const artboardUid = String(artboard.objectID())
  const documentName = String(document.cloudName().toString())
  const documentUid = String(document.cloudDocumentKey())
  
  console.log('artboardName:', artboardName)
  console.log('artboardUid:', artboardUid)
  console.log('documentName:', documentName)
  console.log('documentUid:', documentUid)

  // TODO: documentUid is not really unique between duplicate files

  fetch(`${process.env.SENSIVE_API_URL}/api/snapshots/sketch/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Application-Token': Settings.settingForKey('userApplicationToken'),
    },
    body: JSON.stringify({
      snapshot: {
        artboard_name: artboardName,
        artboard_uid: artboardUid,
        document_name: documentName,
        document_uid: documentUid,
        url: imageURL,
      },
    })
  }).then(response => { console.log(response) }).then(text => {
    context.actionContext.document.showMessage("Done!")
  }).catch(e => console.log(e))
}

const uploadImage = (artboard, filepath) => {
  const { document } = context.actionContext
  const imageFile = NSData.alloc().initWithContentsOfFile(filepath)
  const imageChanged = () => Settings.documentSettingForKey(document, `SIZE-${artboard.objectID()}`) != imageFile.length()

  if (imageChanged()){
    document.showMessage("Syncing with Sensive…")
    
    fetch(`${process.env.SENSIVE_API_URL}/api/images/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-User-Application-Token': Settings.settingForKey('userApplicationToken'),
      },
      body: imageFile
    }).then(response => {
      const { url } = JSON.parse(response.text()._value)
      sendSnapshot(url, artboard)
    }).catch(e => console.log(e))

    Settings.setDocumentSettingForKey(document, `SIZE-${artboard.objectID()}`, imageFile.length())
  }
}

export function onDocumentSaved(context) {
  const { document } = context.actionContext
  const currentArtboard = document.findCurrentArtboardGroup()
  
  if (trackingEnabled && currentArtboard){
    exportImage(currentArtboard, uploadImage)

    // const document = context.actionContext.document
    // document.pages().forEach((page) => {
    //   page.artboards().forEach((artboard) => {
    //     new Promise((resolve, reject) => {
    //       exportImage(artboard, uploadImage("http://localhost:5000/api/images/upload", artboard))
    //     })
    //   })
    // })
  }
}
      
export function onArtboardChanged(context) {
  const { document, oldArtboard, newArtboard } = context.actionContext
  const artboardChanged = () => oldArtboard != newArtboard

  if (trackingEnabled(document) && artboardChanged()){
    exportImage(oldArtboard, uploadImage)
  }
}
