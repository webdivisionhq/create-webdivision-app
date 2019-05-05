const inquirer = require('inquirer');
const Listr = require('listr');
const tasksColl = require('./tasks');
const u = require('./utils');

async function script({ verbose }) {
   const { projType } = await inquirer.prompt({
      type: 'list',
      name: 'projType',
      message: 'Select project type',
      choices: [
         {
            name: 'Frontend (React)',
            value: 'react',
         },
         {
            name: 'Backend',
            value: 'node',
         },
      ],
   });

   const { tasks } = await inquirer.prompt({
      type: 'checkbox',
      name: 'tasks',
      message: 'What do you want to do?',
      choices: [
         {
            name: 'Set up Eslint & Prettier',
            value: 'eslint',
         },
         {
            name: 'Set up lint-staged & husky',
            value: 'lintstaged',
         },
         {
            name: 'Add lint scripts',
            value: 'scripts',
         },
      ],
   });

   u.checkIfPackageJSONExists();

   const jobs = new Listr(
      tasks.map(task => {
         return tasksColl[task]({ verbose, projType });
      })
   );

   jobs.run().catch(err => {
      console.error(err);
   });
}

module.exports = script;
