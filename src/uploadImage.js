const fetch = require('sketch-polyfill-fetch')
const Settings = require('sketch/settings')

const sendSnapshot = (imageURL, document, artboard) => {
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

export function uploadImage(document, artboard, filepath){
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
      if(response.ok){
        const { url } = JSON.parse(response.text()._value)
        sendSnapshot(url, document, artboard)
      } else {
        document.showMessage(`There was an error when syncing ${artboard.name()}…`)
      }
    })

    Settings.setDocumentSettingForKey(document, `SIZE-${artboard.objectID()}`, imageFile.length())
  }
}
