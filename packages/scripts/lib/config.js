const fs = require('fs')
const path = require('path')

const APP_DIR = fs.realpathSync(process.cwd())
const resolvePath = relativePath => path.resolve(APP_DIR, relativePath)

exports.PACKAGE_JSON_FILE = resolvePath('package.json')
exports.BIN_DIR = resolvePath('node_modules/.bin')
exports.YARN_LOCK_FILE = resolvePath('yarn.lock')
