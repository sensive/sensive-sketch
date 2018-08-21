const fetch = require('sketch-polyfill-fetch')
const sketch = require('sketch')
const fs = require("@skpm/fs")

export function onDocumentSaved(context) {
  let activeArboard;
  activeArboard = context.actionContext.document.findCurrentArtboardGroup()

  const exportImage = (artboard) => {
    // let slice = MSExportRequest.exportRequestsFromExportableLayer(artboard).firstObject();
    // slice.scale = 1;
    // slice.saveForWeb = false;
    // slice.format = "png";
    context.actionContext.document.saveArtboardOrSlice_toFile(artboard, `/tmp/${artboard.name()}.png`);
    return `/tmp/${artboard.name()}.png`
  }


  const uploadImage = (url, fullpathFilename) => {
    const file = NSData.alloc().initWithContentsOfFile(fullpathFilename);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        "X-User-Application-Token": "def37cf2c791b7a766edbde95fa14694"
      },
      body: file
    }).then(response => {
      const url = JSON.parse(response.text()._value).url
      console.log(url)
    }).then(text => {
        context.actionContext.document.showMessage("File uploaded! 🙌");
        // console.log(text)
      }
    ).catch(e => console.log(e));
  };
  uploadImage("http://localhost:3000/api/images/upload", exportImage(activeArboard))

  const pages = context.actionContext.document.pages()
  const document = sketch.fromNative(context.actionContext.document)
  context.actionContext.document.showMessage(context.action)
}

export function onArtboardChanged(context) {
  // log(context)
  context.actionContext.document.showMessage(context.action)
}