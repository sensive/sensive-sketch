import { documentIdentifier } from "./utils"

const ExportRequest = (object) => {
  return MSExportRequest.exportRequestsFromExportableLayer(object).firstObject()
}

export function exportImage(document, object, options){
  const exportRequest = new ExportRequest(object)
  exportRequest.scale = options.scale
  exportRequest.format = options.format
  exportRequest.saveForWeb = false

  const path = `/tmp/${documentIdentifier(document)}/${options.path}.${options.format}`

  return new Promise(resolve => {
    document.saveArtboardOrSlice_toFile(exportRequest, path)
    resolve(path)
  })
}
