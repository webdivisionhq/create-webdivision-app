const packageTemplate = require('./templates/package-template');
// const logSymbols = require('log-symbols');
// const logUpdate = require('log-update');
// const ora = require('ora');
const u = require('./utils');

exports.eslint = ({ verbose }) => {
   u.install('@webdivision/eslint-config', { verbose });
   // u.install('install-peerdeps');
   // u.installPeerDeps('@webdivision/eslint-config');
   // u.installPeerDeps('eslint-config-react-app');

   const appPackage = u.readPackageJSON();

   appPackage.eslintConfig = packageTemplate.eslintConfig;
   appPackage.prettier = packageTemplate.prettier;

   u.updatePackageJSON(appPackage);
};

exports.scripts = () => {
   let appPackage = u.readPackageJSON();

   if (appPackage.scripts && (appPackage.scripts.format || appPackage.scripts.lint || appPackage.scripts['lint:fix'])) {
      console.log(
         'Skipping scripts configuration - one of format/lint/lint:fix scripts already exists in package.json'
      );
   } else {
      appPackage = {
         ...appPackage,
         scripts: {
            ...appPackage.scripts,
            ...packageTemplate.scripts,
         },
      };
   }

   u.updatePackageJSON(appPackage);
};

exports.lintstaged = () => {
   u.install('husky', 'lint-staged');

   const appPackage = u.readPackageJSON();

   if (appPackage.husky) {
      console.log('Skipping husky configuration - husky key already exists in package.json');
   } else {
      appPackage.husky = packageTemplate.husky;
   }

   if (appPackage['lint-staged']) {
      console.log('Skipping lint-staged configuration - lint-staged key already exists in package.json');
   } else {
      appPackage['lint-staged'] = packageTemplate['lint-staged'];
   }

   u.updatePackageJSON(appPackage);
};
