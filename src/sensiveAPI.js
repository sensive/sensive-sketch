import { Settings } from 'sketch'

const API_URL_BASE = {
  'development': 'http://localhost:5000',
  'staging':     'https://staging.sensive.co',
  'production':  'https://sensive.co',
}

export const API_URL = API_URL_BASE[process.env.SKPM_ENV]

export const Endpoints = {
  DOCUMENTS: `${API_URL}/api/sketch/v1/documents`,
  SNAPSHOTS: `${API_URL}/api/sketch/v1/snapshots`,
  ASSETS:    `${API_URL}/api/sketch/v1/assets`,
}

export const authTokenHeader = {
  'X-User-Application-Token': Settings.settingForKey('userApplicationToken'),
}

export const Schema = (schema) => JSON.stringify(schema)
