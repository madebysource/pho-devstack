var karma = require('karma');
var spawn = require('child_process').spawn;
var path = require('path');
var chalk = require('chalk');

module.exports = {
  karma: function() {
    karma.server.start({ configFile: path.join(process.cwd(), 'karma.conf.js'), singleRun: true, autoWatch: false }, process.exit);
  },

  karmaWatch: function() {
    karma.server.start({ configFile: path.join(process.cwd(), 'karma.conf.js'), singleRun: false, autoWatch: true }, process.exit);
  },

  casper: function(testPath) {
    var casper = spawn(path.join(__dirname, 'node_modules/casperjs/bin/casperjs'), ['test', testPath]);

    casper.stdout.on('data', function(data) {
      console.log('[' + chalk.green('gulp') + '] CasperJS ' + data.toString().slice(0, -1));
    });

    casper.stdout.on('close', process.exit);
  }
};
