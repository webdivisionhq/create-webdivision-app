const inquirer = require('inquirer');
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

   tasks.forEach(task => {
      tasksColl[task]({ verbose });
   });
}

module.exports = script;
