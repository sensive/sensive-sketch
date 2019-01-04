# Sketch Sync

## Getting Started

1. `npm i -g penv` to install [penv](https://github.com/julianduque/penv)

2. `penv development` to generate the `package.json` for development environment

3. `npm i` to install dependencies _and_ to create symlink of plugin file in Sketch directory

4. `npm run watch` for local dev, pair with live reloading setting:

    ``` bash
    defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES
    ```

## Debugging

1. Install [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
2. Use `console.log` as normal in JavaScript files

## Testing in Staging

1. Use `penv staging` to generate correct `package.json` (instead of `development`)
2. Follow the same steps on [Getting Started](#getting-started)

## Publishing

1. Change version in `.package.json` (NOT `package.json`, as it’s ignored from version control)
2. Run `penv production` to generate the correct `package.json`
3. Use `skpm publish -h` to determine what options to use to match the new version
