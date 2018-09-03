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

  if (
    (typeof Settings.settingForKey('userApplicationToken') != 'undefined') ||
           (Settings.settingForKey('userApplicationToken') != null)
  ){
    console.log(typeof Settings.settingForKey('userApplicationToken'))
    console.log(       Settings.settingForKey('userApplicationToken'))
    
    toggle()
  } else {
    let collectedUserApplicationToken = UI.getStringFromUser("Enter your Sensive token", '')

    Settings.setSettingForKey('userApplicationToken', collectedUserApplicationToken)

    toggle()
  }
}