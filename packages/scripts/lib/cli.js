const factory = require('yargs/yargs');
const script = require('./script');

process.on('unhandledRejection', err => {
   throw err;
});

function cli(cwd) {
   const parser = factory(null, cwd);

   parser.alias('h', 'help');
   parser.alias('v', 'version');

   parser.usage(
      '$0',
      'WebDivision scripts',
      yargs => {
         yargs.options({
            verbose: {
               describe: 'enable verbose mode',
            },
         });
      },
      argv => {
         script(argv).catch(e => {
            console.error(e);
         });
      }
   );

   return parser;
}

module.exports = cli;
