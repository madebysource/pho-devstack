'use strict';
var chalk = require('chalk');
var path = require('path');

module.exports = {
  dist: {
    markupDir: 'dist/',
    scriptDir: 'dist/scripts/',
    styleDir: 'dist/styles/',
    scriptFiles: '*.js',
    styleFiles: '*.css'
  },
  src: {
    markupDir: 'src/',
    scriptDir: 'src/scripts/',
    styleDir: 'src/styles/',
    specDir: 'spec/',
    e2eDir: 'e2e/',
    markupMain: 'index.html',
    scriptMain: 'main.js',
    styleMain: 'main.less',
    markupFiles: '**/*.html',
    scriptFiles: '**/*.js',
    styleFiles: '**/*.less',
    specFiles: '**/*Spec.js'
  },
  browserify: {
    debug: true,
    detectGlobals: false,
    transform: ['browserify-ngmin', 'uglifyify']
  },
  htmlmin: {
    collapseWhitespace: true,
    removeComments: true
  },
  inject: {
    transform: function(filepath) {
      if (filepath.indexOf('.js') !== -1)
        return '<script src="' + filepath.substr(6) + '"></script>';
      else
        return '<link rel="stylesheet" href="' + filepath.substr(6) + '" />';
    }
  },
  less: {
    compress: true,
    paths: [
      'src/styles/',
      'src/bower_components/lesshat/build'
    ],
    sourceMap: true
  },
  plumber: {
    errorHandler: function(err) {
      var beep = '\x07';
      var line2 = chalk.red(err.message);
      var line1 = beep + '[' + err.plugin + '] ' + err.name;
      if (err.fileName)
        line1 += ' in ' + path.relative(process.cwd(), err.fileName) + ':' + chalk.bold(err.lineNumber);
      else if (err.lineNumber)
        line1 += ' at line ' + chalk.bold(err.lineNumber);

      console.log(line1);
      console.log(line2);
    }
  }
};
