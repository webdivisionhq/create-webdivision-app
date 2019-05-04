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

function logError(msg, proc, verbose) {
   if (proc.status !== 0) {
      if (!verbose) {
         console.error(proc.stderr.toString());
      }
      throw new Error(msg);
   }
}

exports.install = (packages, { verbose }) => {
   const pkgs = [].concat(packages);

   const proc = spawn.sync(pkgCommand, [...defaultArgs, ...pkgs], {
      ...(verbose && { stdio: 'inherit' }),
   });

   logError(`${pkgs.join(',')} installation failed`, proc, verbose);
};

exports.installPeerDeps = (pkg, { verbose }) => {
   const proc = spawn.sync(path.resolve(BIN_DIR, 'install-peerdeps'), ['-d', pkg, useYarn && '-Y'].filter(Boolean), {
      ...(verbose && { stdio: 'inherit' }),
   });
   logError(`${pkg} installation failed`, proc, verbose);
};

exports.checkIfPackageJSONExists = () => {
   if (!fs.existsSync(PACKAGE_JSON_FILE)) {
      throw new Error(`Can't find the package.json file in ${PACKAGE_JSON_FILE}`);
   }
};

exports.updatePackageJSON = appPackage => {
   fs.writeFileSync(PACKAGE_JSON_FILE, JSON.stringify(appPackage, null, 2) + os.EOL);
};

exports.readPackageJSON = () => {
   const pkg = fs.readFileSync(PACKAGE_JSON_FILE);
   return JSON.parse(pkg);
};
