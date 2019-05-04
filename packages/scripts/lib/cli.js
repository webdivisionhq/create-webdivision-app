const factory = require('yargs/yargs');
const script = require('./script');

function cli(cwd) {
   const parser = factory(null, cwd);

   parser.alias('h', 'help');
   parser.alias('v', 'version');

   parser.usage(
      '$0',
      'TODO: description',
      yargs => {
         yargs.options({
            // TODO: options
         });
      },
      argv => script(argv)
   );

   return parser;
}

module.exports = cli;
