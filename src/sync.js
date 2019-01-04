import { exportImage, sendSnapshot, sendAsset, exportablesFromArtboards, notify, exportableIdentifier, documentSchema } from './utils'
import { sendDocument } from './sendDocument'

export function syncArtboards(artboards, document) {
  const exportables = exportablesFromArtboards(artboards, document)
  const snapshots = []
  const snapshotStatuses = []

  const progress = () => `${snapshots.length}/${artboards.length}`
  const artboardsDoneExporting = () => artboards.length === snapshots.length

  const snapshotProgress = () => `${snapshotStatuses.length}/${snapshots.length}`
  const snapshotsDoneUploading = () => snapshotStatuses.length === snapshots.length

  const syncArtboards = () => {
    return new Promise((resolve) => {
      artboards.map(artboard => {
        exportImage(
          document,
          artboard,
          { scale: 2, format: 'png', path: artboard.objectID() }
        ).then(path => queueSnapshot({ document, artboard, path }))
      })

      resolve(snapshots)
    })
  }

  const queueSnapshot = (snapshot) => {
    snapshots.push(snapshot)
    showMessageArtboardsProgress()

    if (artboardsDoneExporting()) {
      uploadSnapshots()
    }
  }

  const uploadSnapshots = () => {
    snapshots.forEach(snapshot => {
      sendSnapshot(snapshot, status => addSnapshotStatus(status))
    })
  }

  const addSnapshotStatus = (snapshotStatus) => {
    snapshotStatuses.push(snapshotStatus)

    showMessageSnapshotsProgress()

    if (snapshotsDoneUploading()) {
      showMessageDone()
      snapshots.length = 0
      snapshotStatuses.length = 0
    }
  }

  const showMessageArtboardsProgress = () => notify(document, `Generating snapshots… (${progress()})`)
  const showMessageSnapshotsProgress = () => notify(document, `Uploading… (${snapshotProgress()})`)
  const showMessageDone = () => notify(document, `All up-to-date! 👌`)

  const syncExportables = () => {
    exportables.map(exportable => {
      const { object, scale, format } = exportable
      exportImage(
        document,
        object,
        { scale, format, path: exportableIdentifier(exportable) }
      ).then(path => uploadAsset({path, ...exportable}))
    })
  }

  const uploadAsset = (asset) => {
    sendAsset(asset, status => console.log(status))
  }

  sendDocument(documentSchema(document, artboards))
    .then(syncArtboards)
    .then(syncExportables)
}
