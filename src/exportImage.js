export function exportImage(document, object, options){
  const slice = MSExportRequest.exportRequestsFromExportableLayer(object).firstObject()
  slice.scale = options.scale
  slice.format = options.format
  slice.saveForWeb = false

  const path = `/tmp/${document.cloudDocumentKey()}/${object.objectID()}.${options.format}`

  return new Promise(resolve => {
    document.saveArtboardOrSlice_toFile(slice, path)
    resolve(path)
  })
}
