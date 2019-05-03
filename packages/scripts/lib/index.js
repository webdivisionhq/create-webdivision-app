"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const spawn = require("cross-spawn");
const Listr = require("listr");
const inquirer = require("inquirer");
const packageTemplate = require("./package-template");

const PACKAGE_JSON_PATH = path.resolve(process.cwd(), "package.json");

process.on("unhandledRejection", err => {
  throw err;
});

function installPeerDeps(pkg) {
  const proc = spawn.sync(`npx install-peerdeps --dev ${pkg}`, {
    stdio: "inherit",
    shell: true
  });
  if (proc.status !== 0) {
    console.error(`${pkg} peer deps installation failed`);
    return;
  }
}

function npmInstall(pkg) {
  const proc = spawn.sync(`npm i -D ${pkg}`, {
    stdio: "inherit",
    shell: true
  });
  if (proc.status !== 0) {
    console.error(`${pkg} installation failed`);
    return;
  }
}

function checkIfNpmExists() {
    if (!fs.existsSync(PACKAGE_JSON_PATH)) {
      throw new Error(`Can't find the package.json file in ${PACKAGE_JSON_PATH}`);
    }
}


async function script() {
  const { tasks } = await inquirer.prompt({
    type: "checkbox",
    name: "tasks",
    message: "What you want to do?",
    choices: [
      { name: "Install eslint+prettier", value: "eslint" },
      { name: "Set up lint-staged", value: "lintstaged" },
      { name: "Set lint-scripts", value: "scripts" },
    ]
  });

  if (tasks.includes("eslint")) {
    checkIfNpmExists();

    const proc = spawn.sync(`npm i -D @webdivision/eslint-config`, {
      stdio: "inherit",
      shell: true
    });
    if (proc.status !== 0) {
      console.error(`@webdivision/eslint-config peer deps installation failed`);
      return;
    }
    installPeerDeps("@webdivision/eslint-config");
    installPeerDeps("eslint-config-react-app");

    const appPackage = require(PACKAGE_JSON_PATH, "package.json");
      appPackage.eslintConfig = packageTemplate.eslintConfig;
      updatePackageJSON(appPackage);
  }


if(tasks.includes('scripts')) {
  let appPackage = require(PACKAGE_JSON_PATH, "package.json");

  checkIfNpmExists();
  if(appPackage.scripts && (appPackage.scripts.format || appPackage.scripts.lint || appPackage.scripts['lint:fix'])) {
    console.log('Skipping scripts configuration - one of format/lint/lint:fix scripts already exists in package.json')
  } else {
    appPackage = {...appPackage, scripts: { ...appPackage.scripts, ...packageTemplate.scripts}}
  }

  updatePackageJSON(appPackage);
}



if(tasks.includes('lintstaged')) {
  checkIfNpmExists();
  
  npmInstall('husky');
  npmInstall('lint-staged');

  const appPackage = require(PACKAGE_JSON_PATH, "package.json");

  if(appPackage.husky) {
    console.log('Skipping husky configuration - husky key already exists in package.json')
  } else {
    appPackage.husky = packageTemplate.husky;
  }
  
  if(appPackage['lint-staged']) {
    console.log('Skipping lint-staged configuration - lint-staged key already exists in package.json')
  } else {
    appPackage['lint-staged'] = packageTemplate['lint-staged'];
  }

  updatePackageJSON(appPackage);
}

}

module.exports = script;
function updatePackageJSON(appPackage) {
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(appPackage, null, 2) + os.EOL);
}

