import { Settings } from 'sketch'
import fetch from 'sketch-polyfill-fetch'
import mime from 'mime-types'

export function sendAsset(asset, callback){
  const artboardUid = String(asset.artboard.objectID())
  const documentUid = String(asset.document.cloudDocumentKey())

  const assetName = String(asset.name)
  const assetFormat = String(asset.format)
  const assetScale = String(asset.scale)
  const assetSuffix = asset.suffix ? String(asset.suffix) : ''
  const assetUid = String(asset.uid)

  const { uid, name, scale, suffix, format } = asset
  const settingName = `SIZE-ASSET-${uid}-${name}-${scale}-${suffix}-${format}`

  const image = NSData.alloc().initWithContentsOfFile(asset.path)
  const imageIsUnchanged = () => Settings.documentSettingForKey(asset.document, settingName) === image.length()

  if (imageIsUnchanged()) return callback({ status: 'asset unchanged' })

  fetch(`${process.env.SENSIVE_API_URL}/api/sketch/v1/assets`, {
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
      'X-User-Application-Token': Settings.settingForKey('userApplicationToken'),
    },
    body: image
  }).then(response => {
    if (response.ok) return callback({ status: 'asset ok' })

    return callback({ status: 'asset error', artboardName: asset.artboard.name() })
  })

  Settings.setDocumentSettingForKey(asset.document, settingName, image.length())
}
