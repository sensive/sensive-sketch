import openLink from './openLink.js'

export function aboutUsLink() {
  openLink(`${process.env.SENSIVE_API_URL}/about?source=sketch`)
}

export function termsOfServiceLink() {
  openLink(`${process.env.SENSIVE_API_URL}/terms?source=sketch`)
}

export function privacyPolicyLink() {
  openLink(`${process.env.SENSIVE_API_URL}/privacy?source=sketch`)
}
