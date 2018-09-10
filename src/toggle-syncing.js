const UI = require('sketch/ui')
const Settings = require('sketch/settings')

export function toggleSyncing(context) {
  const toggle = () => {
    switch (Settings.documentSettingForKey(context.document, 'trackDocument')) {
      case true:
        Settings.setDocumentSettingForKey(context.document, 'trackDocument', false)
        context.document.showMessage(`Stopped syncing changes for ${context.document.cloudName()}`)
        break;
      default:
        Settings.setDocumentSettingForKey(context.document, 'trackDocument', true)
        context.document.showMessage(`Started syncing changes for ${context.document.cloudName()}`)
    }
  }

  if (Settings.settingForKey('userApplicationToken')){
    toggle()
  } else {
    let collectUserApplicationToken = UI.getStringFromUser("Enter your Sensive token", '')
    Settings.setSettingForKey('userApplicationToken', collectUserApplicationToken)

    toggleSyncing(context)
  }
}