export function exportImage(document, artboard, callback){
  const filepath = `/tmp/${artboard.objectID()}.png`
  const slice = MSExportRequest.exportRequestsFromExportableLayer(artboard).firstObject()
  slice.scale = 2
  slice.saveForWeb = false
  slice.format = "png"
  document.saveArtboardOrSlice_toFile(slice, filepath)
  console.log(filepath)
  callback(document, artboard, filepath)
}
