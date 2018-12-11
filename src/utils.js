export * from './exportImage'
export * from './sendSnapshot'
export * from './sendAsset'
export * from './toggleSyncing'

export const objectIsSymbol = (object) => object.class() === 'MSSymbolMaster'
export const objectIsArtboard = (object) => object.class() === 'MSArtboardGroup'
export const objectIsGroup = (object) => object.class() === 'MSLayerGroup'

export const objectIsContainer = (object) => {
  return objectIsGroup(object) || objectIsArtboard(object)
}

export const objectHasExportables = (object) => {
  return object.exportOptions().exportFormats().length > 0
}

export const exportableFromObject = (object, format) => {
  return {
    object: object,
    uid: object.objectID(),
    name: object.name(),
    suffix: format.name(),
    scale: format.scale(),
    format: format.fileFormat(),
  }
}

export const exportablesFromArtboards = (artboards, document) => {
  const exportables = []
  artboards.forEach(artboard => {
    exportables.push(
      exportablesFromObject(artboard).map(exportable => ({...exportable, artboard: artboard, document: document }))
    )
  })

  return exportables.flat()
}

export const exportablesFromObject = (object) => {
  const exportables = []

  if (objectHasExportables(object)) {
    const formats = object.exportOptions().exportFormats()
    formats.forEach(format => exportables.push(exportableFromObject(object, format)))
  }

  if (objectIsContainer(object)) {
    const layers = object.layers()
    if (layers.length > 0) {
      layers.forEach(layer => exportables.push(exportablesFromObject(layer)))
    }
  }

  return exportables.flat()
}


export const artboardsFromDocument = (document) => {
  const artboards = []
  document.pages().forEach(page => {
    page.artboards().forEach(artboard => {
      if (objectIsSymbol(artboard)) return

      artboards.push(artboard)
    })
  })
  return Array.from(artboards)
}

export const notify = (document, message) => document.showMessage(message)
