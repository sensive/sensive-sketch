import { Settings, UI } from 'sketch'
import BrowserWindow from 'sketch-module-web-view'
import openLink from './openLink'
import { API_URL } from './sensiveAPI'
import { trackingEnabledForDocument, toggleSyncingForDocument } from './toggleSyncing'
import { Document } from 'sketch/dom'
import { documentIdentifier } from './utils'
import { PANEL_VISIBLE } from './togglePanel'

const baseWindowOptions = {
  resizable: false,
  minimizable: false,
  maximizable: false,
  alwaysOnTop: true,
  fullscreenable: false,
  acceptFirstMouse: true,
  frame: false,
}

const windowOptions = {
  ...baseWindowOptions,
  width: 380,
  height: 480,
}

export function setup () {
  const { loadURL, webContents, close } = new BrowserWindow(windowOptions)

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

  webContents.on('close', () => close())
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

const PANEL_ID = 'sensive-helper-panel'

const INSPECTOR_WIDTH = 240
const PANEL_WIDTH = 140
const PANEL_HEIGHT = 40

const panelOptions = {
  ...baseWindowOptions,
  identifier: PANEL_ID,
  width: PANEL_WIDTH,
  height: PANEL_HEIGHT,
  show: false,
}

export function closeStatusPanel () {
  const panel = BrowserWindow.fromId(PANEL_ID)

  if (panel) { panel.destroy() }
}

export function setStatusPanel (document) {
  if (!Settings.settingForKey(PANEL_VISIBLE)) { return }

  const panel = BrowserWindow.fromId(PANEL_ID)

  if (panel) {
    if (!document) {
      panel.close()
      return
    }

    updatePanel(panel, document)
    return
  }

  updatePanel(createPanel(document), document)
}

// Less likely for this version
// TODO: close/hide panel if there are no more documents open
// TODO: update panel state independently from position
// -- particularly useful when dealing with changes in document later on
// TODO: move progress/notification to the status panel
// TODO: detect document switches
// TODO: detect window change

function updatePanel (panel, document) {
  if (document.documentWindow()) {
    const screenRect = NSScreen.screens().firstObject().frame()
    const windowRect = document.documentWindow().frame()

    panel.setPosition(
      Math.round(
        windowRect.origin.x
        + NSWidth(windowRect)
        - PANEL_WIDTH
        - 10
        - (document.isInspectorVisible() ? INSPECTOR_WIDTH : 0)
      ),
      Math.round(
        NSHeight(screenRect)
        - windowRect.origin.y
        - 10
      ),
      true
    )
  }

  setPanelState(panel, document)
}

function createPanel (document) {
  const panel = new BrowserWindow(panelOptions)

  panel.loadURL(require('./panel.html'))

  panel.on('ready-to-show', () => {
    panel.show()

    setPanelState(panel, document)
  })

  panel.webContents.on('enableSyncing', handleEnableSyncing)
  panel.webContents.on('openLink', (link) => { openLink(API_URL + link) })

  return panel
}

function setPanelState (panel, document) {
  panel.webContents.executeJavaScript(`setDocument(${trackingEnabledForDocument(document)},'${documentIdentifier(document)}','${typeof UI.getTheme === 'function' ? UI.getTheme() : 'default'}')`)
}

function handleEnableSyncing () {
  const document = Document.getSelectedDocument()
  // TODO: ensure document is saved before togglesync
  if (document) { toggleSyncingForDocument(document.sketchObject) }
}
