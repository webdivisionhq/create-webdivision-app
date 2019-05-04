const fs = require('fs');
const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');
const { PACKAGE_JSON_FILE, BIN_DIR, YARN_LOCK_FILE } = require('./config');

const useYarn = fs.existsSync(YARN_LOCK_FILE);

let pkgCommand;
let defaultArgs;

if (useYarn) {
   pkgCommand = 'yarn';
   defaultArgs = ['add', '--dev', '--exact'];
} else {
   pkgCommand = 'npm';
   defaultArgs = ['install', '--save-exact', '-D'];
}

module.exports = {
   install(...pkgs) {
      const proc = spawn.sync(pkgCommand, [...defaultArgs, ...pkgs], {
         stdio: 'inherit',
      });
      if (proc.status !== 0) {
         throw new Error(`${pkgs.join(',')} installation failed`);
      }
   },
   installPeerDeps(pkg) {
      const proc = spawn.sync(path.resolve(BIN_DIR, 'install-peerdeps'), ['-d', pkg], {
         stdio: 'inherit',
      });
      if (proc.status !== 0) {
         throw new Error(`${pkg} peer deps installation failed`);
      }
   },
   checkIfPackageJSONExists() {
      if (!fs.existsSync(PACKAGE_JSON_FILE)) {
         throw new Error(`Can't find the package.json file in ${PACKAGE_JSON_FILE}`);
      }
   },
   updatePackageJSON(appPackage) {
      fs.writeFileSync(PACKAGE_JSON_FILE, JSON.stringify(appPackage, null, 2) + os.EOL);
   },
   readPackageJSON() {
      const pkg = fs.readFileSync(PACKAGE_JSON_FILE);
      return JSON.parse(pkg);
   },
};
