import { Settings } from 'sketch'
import BrowserWindow from 'sketch-module-web-view'
import openLink from './openLink'
import { API_URL } from './sensiveAPI'

const windowOptions = {
  width: 800,
  height: 600,
  titleBarStyle: 'hidden',
  resizable: false,
  minimizable: false,
  maximizable: false,
  alwaysOnTop: true,
  devTools: false,
  fullscreenable: false,
}

export function setup() {
  const { loadURL, webContents } = new BrowserWindow(windowOptions)

  loadURL(`${API_URL}/sketch/sign_in`)

  webContents.on('openLink', (link) => {
    openLink(link)
  })

  webContents.on('clearToken', () => {
    Settings.setSettingForKey('userApplicationToken', null)
  })

  webContents.on('sendToken', (token) => {
    if (typeof token === 'string') {
      Settings.setSettingForKey('userApplicationToken', token)
    }
  })
}

export function requireToken(callback) {
  if (Settings.settingForKey('userApplicationToken')) {
    callback()
  } else {
    const { loadURL, webContents, close } = new BrowserWindow(windowOptions)

    loadURL(`${API_URL}/sketch/sign_in`)

    webContents.on('sendToken', (token) => {
      if (typeof token === 'string') {
        Settings.setSettingForKey('userApplicationToken', token)
        close()
        callback()
      }
    })
  }
}
