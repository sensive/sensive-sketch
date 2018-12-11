export default function Snapshot(document, artboard) {
  return {
    documentUID:  String(document.cloudDocumentKey()),
    documentName: String(document.cloudName().toString()),
    artboardUID:  String(artboard.objectID()),
    artboardName: String(artboard.name()),
  }
}
