const fetch = require('sketch-polyfill-fetch')
const Settings = require('sketch/settings')

export function onDocumentSaved(context) {
  const activeArtboard = context.actionContext.document.findCurrentArtboardGroup()
  
  const sendSnapshot = (imageURL) => {
    const document = context.actionContext.document
    
    const artboardName = String(activeArtboard.name())
    const artboardUid = String(activeArtboard.objectID())
    const documentName = String(document.cloudName().toString())
    const documentUid = String(document.cloudDocumentKey())
    
    console.log('artboardName:', artboardName)
    console.log('artboardUid:', artboardUid)
    console.log('documentName:', documentName)
    console.log('documentUid:', documentUid)

    fetch('http://localhost:3000/api/snapshots/sketch/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Application-Token': 'def37cf2c791b7a766edbde95fa14694',
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
  
  const exportImage = (artboard, callback) => {
    // let slice = MSExportRequest.exportRequestsFromExportableLayer(artboard).firstObject()
    // slice.scale = 1
    // slice.saveForWeb = false
    // slice.format = "png"
    const filename = `/tmp/${artboard.name()}.png`
    context.actionContext.document.saveArtboardOrSlice_toFile(artboard, filename)
    console.log(filename)
    setTimeout(() => callback(filename), 500)
  }

  const uploadImage = (url) => (fullpathFilename) => {
    const file = NSData.alloc().initWithContentsOfFile(fullpathFilename)


    context.actionContext.document.showMessage("Sending changes to Sensive…")
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-User-Application-Token': 'def37cf2c791b7a766edbde95fa14694',
      },
      body: file
    }).then(response => {
      const imageURL = JSON.parse(response.text()._value).url
      sendSnapshot(imageURL)
    }).then(text => {
      // console.log(text)
    }).catch(e => console.log(e))
  }

  if (Settings.documentSettingForKey(context.actionContext.document, 'trackDocument') === true){
    exportImage(activeArtboard, uploadImage("http://localhost:3000/api/images/upload"))
  }
}

export function onArtboardChanged(context) {
  // log(context)
  // context.actionContext.document.showMessage(context.action)
}