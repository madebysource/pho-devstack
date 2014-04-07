'use strict';
var path = require('path');
var chalk = require('chalk');

module.exports = {
  dist: {
    markupDir: 'dist/',
    scriptDir: 'dist/scripts/',
    styleDir: 'dist/styles/',
    imageDir: 'dist/images/',
    scriptFiles: '*.js',
    styleFiles: '*.css',
    imageFiles: '**/*.{png,jpg,jpeg}'
  },
  src: {
    markupDir: 'src/',
    scriptDir: 'src/scripts/',
    styleDir: 'src/styles/',
    specDir: 'spec/',
    imageDir: 'src/images/',
    e2eDir: 'e2e/',
    markupMain: 'index.html',
    scriptMain: 'main.js',
    styleMain: 'main.less',
    markupFiles: '**/*.html',
    scriptFiles: '**/*.js',
    styleFiles: '**/*.less',
    specFiles: '**/*Spec.js',
    imageFiles: '**/*.{png,jpg,jpeg}'
  },
  env: {
    development: {
      imagemin: false,
      ngmin: false,
      uglify: false,
      htmlmin: false
    }
  },
  copy: [],
  browserify: {
    debug: true,
    detectGlobals: false
  },
  htmlmin: {
    collapseWhitespace: true,
    removeComments: true
  },
  inject: {
    transform: function(filepath) {
      if (filepath.indexOf('.js') !== -1) {
        return '<script src="' + filepath.substr(6) + '"></script>';
      } else {
        return '<link rel="stylesheet" href="' + filepath.substr(6) + '" />';
      }
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
      var message = beep + '[' + err.plugin + '] ' + err.name;

      if (err.fileName) {
        message += ' in ' + path.relative(process.cwd(), err.fileName) + ':' + chalk.bold(err.lineNumber);
      } else if (err.lineNumber) {
        message += ' at line ' + chalk.bold(err.lineNumber);
      }

      console.log(message);
      console.log(chalk.red(err.message));
    }
  },
  uglify: {
  }
};
