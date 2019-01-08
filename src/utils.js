export * from './exportImage'
export * from './sendSnapshot'
export * from './sendAsset'
export * from './toggleSyncing'

export const ObjectTypes = {
  SYMBOL: 'MSSymbolMaster',
  ARTBOARD: 'MSArtboardGroup',
  LAYER_GROUP: 'MSLayerGroup',
}

export const objectType = (object) => String(object.class())

export const objectIsArtboard = (object) => objectType(object) === ObjectTypes.ARTBOARD
export const objectIsGroup = (object) => objectType(object) === ObjectTypes.LAYER_GROUP
export const objectIsSymbol = (object) => objectType(object) === ObjectTypes.SYMBOL

export const objectIsContainer = (object) => {
  return objectIsGroup(object) || objectIsArtboard(object)
}

export const objectHasExportables = (object) => {
  return object.exportOptions().exportFormats().length > 0
}

export const Exportable = (object, format) => {
  return {
    object: object,
    uid:    String(object.objectID()),
    name:   String(object.name()),
    suffix: format.name() ? String(format.name()) : '',
    scale:  String(format.scale()),
    format: String(format.fileFormat()),
  }
}

export const exportableIdentifier = ({ uid, name, suffix, scale } = exportable) => {
  return `${uid}-${name}-${scale}-${suffix}`
}

export const documentIdentifier = (document) => String(document.cloudDocumentKey())
export const documentName = (document) => String(document.cloudName().toString())

export const objectIdentifier = (object) => String(object.objectID())
export const objectName = (object) => String(object.name())

export const exportablesFromArtboards = (artboards, document) => {
  const exportables = []
  artboards.forEach(artboard => {
    exportables.push(
      exportablesFromObject(artboard).map(exportable => ({ document, artboard, ...exportable }))
    )
  })

  return exportables.flat()
}

export const exportablesFromObject = (object) => {
  const exportables = []

  if (objectHasExportables(object)) {
    const formats = object.exportOptions().exportFormats()
    formats.forEach(format => exportables.push(Exportable(object, format)))
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
      if (objectIsSymbol(artboard)) { return }

      artboards.push(artboard)
    })
  })
  return Array.from(artboards)
}

export const excludeSymbols = (artboards) => {
  return artboards.filter(artboard => !objectIsSymbol(artboard))
}

export const objectSchema = (object) => {
  return {
    uid: objectIdentifier(object),
    name: objectName(object)
  }
}

export const documentSchema = (document, artboards) => {
  return {
    document: {
      uid: documentIdentifier(document),
      name: documentName(document),
      artboards: excludeSymbols(artboards).map(objectSchema)
    }
  }
}

export const notify = (document, message) => document.showMessage(message)
