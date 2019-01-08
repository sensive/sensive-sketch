import { Settings } from 'sketch'
import fetch from 'sketch-polyfill-fetch'
import mime from 'mime-types'
import { exportableIdentifier, documentIdentifier, objectIdentifier } from './utils'
import { Endpoints, authTokenHeader } from './sensiveAPI'

export function sendAsset(asset, callback){
  const settingName = `SIZE-ASSET-${exportableIdentifier(asset)}-${asset.format}`

  const image = NSData.alloc().initWithContentsOfFile(asset.path)

  const imageIsUnchanged = () => Settings.documentSettingForKey(asset.document, settingName) === image.length()

  if (imageIsUnchanged() && asset.format !== 'svg') { return callback({ status: 'asset unchanged' }) }

  fetch(Endpoints.ASSETS, {
    method: 'POST',
    headers: {
      'Content-Type': mime.lookup(asset.format),
      'X-Sketch-Artboard-Uid': objectIdentifier(asset.artboard),
      'X-Sketch-Document-Uid': documentIdentifier(asset.document),
      'X-Sketch-Asset-Name': asset.name,
      'X-Sketch-Asset-Format': asset.format,
      'X-Sketch-Asset-Scale': asset.scale,
      'X-Sketch-Asset-Suffix': asset.suffix,
      'X-Sketch-Asset-UID': asset.uid,
      ...authTokenHeader
    },
    body: image
  }).then(response => {
    if (response.ok) return callback({ status: 'asset ok' })

    return callback({ status: 'asset error' })
  })

  Settings.setDocumentSettingForKey(asset.document, settingName, image.length())
}
