const Listr = require('listr');
const packageTemplate = require('./templates/package-template');
const u = require('./utils');

exports.eslint = ({ verbose, projType }) => ({
   title: 'Setting up eslint & prettier',
   task: () =>
      new Listr([
         {
            title: `Installing @webdivision/eslint-config${projType === 'react' ? '-react' : ''}`,
            task: async () => {
               let config = '@webdivision/eslint-config';
               if (projType === 'react') {
                  config += '-react';
               }
               await u.install(config, { verbose });
            },
         },
         {
            title: `Installing peer deps`,
            task: async () => {
               // TODO this is temporary, fix auto peer deps installing
               await u.install('eslint-config-kentcdodds', { verbose });
            },
         },
         {
            title: 'Configuring eslint inside package.json',
            task: () => {
               const appPackage = u.readPackageJSON();

               appPackage.eslintConfig = { extends: `@webdivision${projType === 'react' ? '/react' : ''}` };

               u.updatePackageJSON(appPackage);
            },
         },
         {
            title: 'Configuring prettier inside package.json',
            task: () => {
               const appPackage = u.readPackageJSON();

               appPackage.prettier = packageTemplate.prettier;

               u.updatePackageJSON(appPackage);
            },
         },
      ]),
});

exports.scripts = () => ({
   title: 'Adding npm scripts',
   task: (_, task) => {
      let appPackage = u.readPackageJSON();

      if (
         appPackage.scripts &&
         (appPackage.scripts.format || appPackage.scripts.lint || appPackage.scripts['lint:fix'])
      ) {
         task.skip(
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
   },
});

exports.lintstaged = () => ({
   title: 'Setting up lint-staged',
   task: async (_, task) => {
      await u.install(['husky', 'lint-staged']);

      const appPackage = u.readPackageJSON();

      if (appPackage.husky) {
         task.skip('Skipping husky configuration - husky key already exists in package.json');
      } else {
         appPackage.husky = packageTemplate.husky;
      }

      if (appPackage['lint-staged']) {
         task.skip('Skipping lint-staged configuration - lint-staged key already exists in the package.json');
      } else {
         appPackage['lint-staged'] = packageTemplate['lint-staged'];
      }

      u.updatePackageJSON(appPackage);
   },
});
