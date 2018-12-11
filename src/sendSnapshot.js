import { Settings } from 'sketch'
import fetch from 'sketch-polyfill-fetch'

export function sendSnapshot(snapshot, callback){
  const artboardName = String(snapshot.artboard.name())
  const artboardUid = String(snapshot.artboard.objectID())
  const documentName = String(snapshot.document.cloudName().toString())
  const documentUid = String(snapshot.document.cloudDocumentKey())

  const image = NSData.alloc().initWithContentsOfFile(snapshot.path)
  const imageIsUnchanged = () => Settings.documentSettingForKey(snapshot.document, `SIZE-${snapshot.artboard.objectID()}`) === image.length()


  if (imageIsUnchanged()) return callback({ status: 'unchanged' })

  fetch(`${process.env.SENSIVE_API_URL}/api/sketch/v1/snapshots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      'X-Sketch-Artboard-Name': artboardName,
      'X-Sketch-Artboard-Uid':  artboardUid,
      'X-Sketch-Document-Name': documentName,
      'X-Sketch-Document-Uid':  documentUid,
      'X-User-Application-Token': Settings.settingForKey('userApplicationToken'),
    },
    body: image
  }).then(response => {
    if (response.ok) return callback({ status: 'ok' })

    return callback({ status: 'error', artboardName: snapshot.artboard.name() })
  })

  Settings.setDocumentSettingForKey(snapshot.document, `SIZE-${snapshot.artboard.objectID()}`, image.length())
}
