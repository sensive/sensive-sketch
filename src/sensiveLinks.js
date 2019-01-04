import openLink from './openLink.js'
import { API_URL } from './sensiveAPI.js'

export function aboutUsLink() {
  openLink(`${API_URL}/about?source=sketch`)
}

export function termsOfServiceLink() {
  openLink(`${API_URL}/terms?source=sketch`)
}

export function privacyPolicyLink() {
  openLink(`${API_URL}/privacy?source=sketch`)
}
