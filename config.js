'use strict';
var path = require('path');
var gutil = require('gulp-util');

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
      var line2 = gutil.colors.red(err.message);
      var line1 = beep + '[' + err.plugin + '] ' + err.name;
      if (err.fileName) {
        line1 += ' in ' + path.relative(process.cwd(), err.fileName) + ':' + gutil.colors.bold(err.lineNumber);
      } else if (err.lineNumber) {
        line1 += ' at line ' + gutil.colors.bold(err.lineNumber);
      }

      console.log(line1);
      console.log(line2);
    }
  },
  uglify: {
  }
};
