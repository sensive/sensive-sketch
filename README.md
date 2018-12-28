# Sketch Sync

## Getting Started

1. `npm i` to install dependencies
2. `npm run start` for local dev
3. Optional but recommended: always reload scripts before running:
    ``` bash
    defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES
    ```

NOTE: use `npm run build:staging` to build version of the plugin that works with staging API.

## Debugging

1. Install [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
2. Use `console.log` as normal in JavaScript files

## Publishing

1. Change version `manifest.json`
2. Use `skpm publish -h` to determine what options to use to match that new version
