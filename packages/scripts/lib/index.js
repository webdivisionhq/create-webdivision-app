const inquirer = require('inquirer')
const packageTemplate = require('./templates/package-template')
const u = require('./utils')

process.on('unhandledRejection', err => {
  throw err
})

async function script() {
  const { tasks } = await inquirer.prompt({
    type: 'checkbox',
    name: 'tasks',
    message: 'What you want to do?',
    choices: [
      {
        name: 'Install eslint+prettier',
        value: 'eslint',
      },
      {
        name: 'Set up lint-staged',
        value: 'lintstaged',
      },
      {
        name: 'Set lint-scripts',
        value: 'scripts',
      },
    ],
  })

  if (tasks.length === 0) {
    return
  }

  u.checkIfPackageJSONExists()

  if (tasks.includes('eslint')) {
    u.install('@webdivision/eslint-config', 'install-peerdeps')
    u.installPeerDeps('@webdivision/eslint-config')
    u.installPeerDeps('eslint-config-react-app')

    const appPackage = u.readPackageJSON()

    appPackage.eslintConfig = packageTemplate.eslintConfig
    appPackage.prettier = packageTemplate.prettier

    u.updatePackageJSON(appPackage)
  }

  if (tasks.includes('scripts')) {
    let appPackage = u.readPackageJSON()

    if (
      appPackage.scripts &&
      (appPackage.scripts.format || appPackage.scripts.lint || appPackage.scripts['lint:fix'])
    ) {
      console.log('Skipping scripts configuration - one of format/lint/lint:fix scripts already exists in package.json')
    } else {
      appPackage = {
        ...appPackage,
        scripts: {
          ...appPackage.scripts,
          ...packageTemplate.scripts,
        },
      }
    }

    u.updatePackageJSON(appPackage)
  }

  if (tasks.includes('lintstaged')) {
    u.install('husky', 'lint-staged')

    const appPackage = u.readPackageJSON()

    if (appPackage.husky) {
      console.log('Skipping husky configuration - husky key already exists in package.json')
    } else {
      appPackage.husky = packageTemplate.husky
    }

    if (appPackage['lint-staged']) {
      console.log('Skipping lint-staged configuration - lint-staged key already exists in package.json')
    } else {
      appPackage['lint-staged'] = packageTemplate['lint-staged']
    }

    u.updatePackageJSON(appPackage)
  }
}

module.exports = script
