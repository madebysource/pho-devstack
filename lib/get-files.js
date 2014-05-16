var path = require('path');
var gs = require('glob-stream');
var through = require('through2');

// get stream of filenames in directory
var files = function(dir, format) {
  return gs.create(dir)
    .pipe(through.obj(function(file, enc, callback) {
      this.push(format(path.basename(file.path)));
      callback();
    }));
};


module.exports = files;
