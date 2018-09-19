const UI = require('sketch/ui')
const Settings = require('sketch/settings')

export function toggleSyncing(context) {
  const toggle = () => {
    const tracking = Settings.documentSettingForKey(context.document, 'trackDocument')
    Settings.setDocumentSettingForKey(context.document, 'trackDocument', !tracking)
    context.document.showMessage(`${tracking ? 'Stopped' : 'Started'} syncing changes for ${context.document.cloudName()}`)
  }

  if (Settings.settingForKey('userApplicationToken')){
    toggle()
  } else {
    let collectUserApplicationToken = UI.getStringFromUser("Enter your Sensive token", '')
    Settings.setSettingForKey('userApplicationToken', collectUserApplicationToken)

    toggleSyncing(context)
  }
}
