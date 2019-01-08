import { Settings } from 'sketch'
import fetch from 'sketch-polyfill-fetch'
import { Endpoints, authTokenHeader } from './sensiveAPI'

export function sendSnapshot(snapshot, callback){
  const artboardUid = String(snapshot.artboard.objectID())
  const documentUid = String(snapshot.document.cloudDocumentKey())

  const image = NSData.alloc().initWithContentsOfFile(snapshot.path)
  const imageIsUnchanged = () => Settings.documentSettingForKey(snapshot.document, `SIZE-${snapshot.artboard.objectID()}`) === image.length()

  if (imageIsUnchanged()) return callback({ status: 'unchanged' })

  fetch(Endpoints.SNAPSHOTS, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      'X-Sketch-Artboard-Uid':  artboardUid,
      'X-Sketch-Document-Uid':  documentUid,
      ...authTokenHeader
    },
    body: image
  }).then(response => {
    if (response.ok) return callback({ status: 'ok' })

    return callback({ status: 'error', artboardName: snapshot.artboard.name() })
  })

  Settings.setDocumentSettingForKey(snapshot.document, `SIZE-${snapshot.artboard.objectID()}`, image.length())
}
