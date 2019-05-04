const inquirer = require('inquirer');
const Listr = require('listr');
const tasksColl = require('./tasks');
const u = require('./utils');

async function script({ verbose }) {
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
         return tasksColl[task]({ verbose });
      })
   );

   jobs.run().catch(err => {
      console.error(err);
   });
}

module.exports = script;
