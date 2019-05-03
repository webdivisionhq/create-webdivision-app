"use strict";

const fs = require("fs");
const path = require("path");
const Listr = require("listr");
const inquirer = require("inquirer");


process.on("unhandledRejection", err => {
  throw err;
});

// async function script() {
//   const {tasks} = await inquirer.prompt({
//     type: "checkbox",
//     name: "tasks",
//     message: "What you want to do?",
//     choices: [{ name: "Install eslint+prettier", value: "eslint" }, { name: "Set up lint-staged", value: "lintstaged" }]
//   });
  
// const availableTasks = {
//     'eslint': {
//       title: "Installing",
//       task: () => {
//         const packageJSONPath = path.resolve(process.cwd(), "package.json");

//         if (!fs.existsSync(packageJSONPath)) {
//           throw new Error(
//             `Can't find the package.json file in ${packageJSONPath}`
//           );
//         }
//       }
//     }
// }

// const tasksList = new Listr(tasks.map(taskName => availableTasks[taskName]));


//   tasksList.run().catch(err => {
//     console.error(err);
//   });

module.exports = script;
