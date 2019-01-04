import { Settings } from 'sketch'
import fetch from 'sketch-polyfill-fetch'
import mime from 'mime-types'
import { exportableIdentifier } from './utils'
import { Endpoints, authTokenHeader } from './sensiveAPI'

export function sendAsset(asset, callback){
  const artboardUid = String(asset.artboard.objectID())
  const documentUid = String(asset.document.cloudDocumentKey())

  const assetName = String(asset.name)
  const assetFormat = String(asset.format)
  const assetScale = String(asset.scale)
  const assetSuffix = asset.suffix ? String(asset.suffix) : ''
  const assetUid = String(asset.uid)

  const settingName = `SIZE-ASSET-${exportableIdentifier(asset)}-${asset.format}`

  const image = NSData.alloc().initWithContentsOfFile(asset.path)
  const imageIsUnchanged = () => Settings.documentSettingForKey(asset.document, settingName) === image.length()

  if (imageIsUnchanged()) return callback({ status: 'asset unchanged' })

  fetch(Endpoints.ASSETS, {
    method: 'POST',
    headers: {
      'Content-Type': mime.lookup(assetFormat),
      'X-Sketch-Artboard-Uid':  artboardUid,
      'X-Sketch-Document-Uid':  documentUid,
      'X-Sketch-Asset-Name': assetName,
      'X-Sketch-Asset-Format': assetFormat,
      'X-Sketch-Asset-Scale': assetScale,
      'X-Sketch-Asset-Suffix': assetSuffix,
      'X-Sketch-Asset-UID': assetUid,
      ...authTokenHeader
    },
    body: image
  }).then(response => {
    if (response.ok) return callback({ status: 'asset ok' })

    return callback({ status: 'asset error', artboardName: asset.artboard.name() })
  })

  Settings.setDocumentSettingForKey(asset.document, settingName, image.length())
}
