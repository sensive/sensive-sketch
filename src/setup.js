const UI = require('sketch/ui')
const Settings = require('sketch/settings')

export function setup() {
  Settings.setSettingForKey(
    'userApplicationToken', 
    UI.getStringFromUser(
      "Enter your Sensive token", 
      Settings.settingForKey('userApplicationToken')
    )
  )
}