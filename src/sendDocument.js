import fetch from 'sketch-polyfill-fetch'
import { Endpoints, authTokenHeader, Schema } from './sensiveAPI'

export function sendDocument(documentSchema){
  return fetch(Endpoints.DOCUMENTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authTokenHeader },
    body: Schema(documentSchema)
  }).then(response => {
    if (response.ok) return console.log(Schema(documentSchema))

    // return callback({ status: 'error', artboardName: snapshot.artboard.name() })
  })
}
