const Settings = require('sketch/settings')
import BrowserWindow from 'sketch-module-web-view'

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
  const browserWindow = new BrowserWindow(windowOptions)
  
  browserWindow.loadURL(`${process.env.SENSIVE_API_URL}/sketch/sign_in`)

  browserWindow.webContents.on('openLink', (link) => {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(link))
  })

  browserWindow.webContents.on('clearToken', () => {
    Settings.setSettingForKey('userApplicationToken', null)
  })

  browserWindow.webContents.on('sendToken', (token) => {
    if (typeof token === 'string') {  
      Settings.setSettingForKey('userApplicationToken', token)
    }
  })
}

export function requireToken(callback) {
  if (Settings.settingForKey('userApplicationToken')) {
    callback()
  } else {
    const browserWindow = new BrowserWindow(windowOptions)
    
    browserWindow.loadURL(`${process.env.SENSIVE_API_URL}/sketch/sign_in`)
  
    browserWindow.webContents.on('sendToken', (token) => {
      if (typeof token === 'string') {  
        Settings.setSettingForKey('userApplicationToken', token) 
        browserWindow.close()
        callback()
      }
    })
  }
}