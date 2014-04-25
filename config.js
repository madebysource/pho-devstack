/**
 * This file contains default options for dev stack
 */

'use strict';
var path = require('path');
var chalk = require('chalk');

module.exports = {
  dist: {
    /* Directories and file patterns for build output */
    markupDir: 'dist/',
    scriptDir: 'dist/scripts/',
    styleDir: 'dist/styles/',
    imageDir: 'dist/images/',
    markupFiles: '**/*.html',
    scriptFiles: '*.js',
    styleFiles: '*.css',
    imageFiles: '**/*.{png,jpg,jpeg}'
  },
  src: {
    /* Directories and file patterns of source files */
    markupDir: 'src/',
    scriptDir: 'src/scripts/',
    styleDir: 'src/styles/',
    specDir: 'spec/',
    imageDir: 'src/images/',
    e2eDir: 'e2e/',
    scriptMain: 'main.js',
    styleMain: 'main.less',
    markupFiles: '**/*.html',
    scriptFiles: '**/*.js',
    styleFiles: '**/*.less',
    specFiles: '**/*Spec.js',
    imageFiles: '**/*.{png,jpg,jpeg}'
  },
  browserify: {
    /* Parses javascript module files with require() functions and produces single bundle */
    /* Option list: https://github.com/substack/node-browserify#bbundleopts-cb */
    enabled: true,        // each plugin can be enabled or disabled by setting this property
    debug: true,          // enable source maps
    detectGlobals: false, // performance optimization
    transforms: {         // transforms can be used for tasks like minification
      // order matters (ngmin wouldn't work after minification)
      // transform-name: transform-is-enabled (true or false)
      "browserify-ngmin": false, // rewrite AngularJS code to be minification-proof
      uglifyify: false           // minifies module with UglifyJS
    }
  },
  clean: {
    /* Clean folder before generating build output (useful for folders with revisioned files) */
    enabled: true
  },
  copy: [
    /* List of folders that will be copied to dist folder */
  ],
  fileInsert: {
    /* Replace any text in markup by file content */
    enabled: false
  },
  htmlmin: {
    /* Markup minification */
    /* Option list: https://github.com/kangax/html-minifier#options-quick-reference */
    enabled: true,
    collapseWhitespace: true, // remove whitespace characters from text nodes and document tree
    removeComments: true      // strip HTML comments
  },
  karma: {
    /* Test runner for JavaScript */
    // configure it in karma.conf.js
    enabled: false
  },
  imagemin: {
    /* Minify PNG, JPEG, GIF and SVG images */
    enabled: true
  },
  inject: {
    /* Inject assets into markup */
    /* Option list: https://github.com/klei/gulp-inject#api */
    enabled: true,
    transform: function(filepath) { // used to generate the content to inject for each file
      if (filepath.indexOf('.js') !== -1) {
        return '<script src="' + filepath.substr(6) + '"></script>';
      } else {
        return '<link rel="stylesheet" href="' + filepath.substr(6) + '" />';
      }
    }
  },
  less: {
    /* LESS style file compilation */
    enabled: true,
    compress: true, // remove whitespace from CSS
    paths: [        // directories for locating less files
      'src/styles/',
      'src/bower_components/lesshat/build'
    ],
    sourceMap: true // enable source maps
  },
  livereload: {
    /* Reload page in browser when build is finished */
    enabled: true
  },
  newer: {
    /* Process only changed files */
    enabled: true
  },
  plumber: {
    /* Handle errors in a way that Gulp doesn't crash */
    enabled: true,
    errorHandler: function(err, plugin) { // custom error message output
      var beep = '\x07';
      var message = beep + '[' + (plugin || err.plugin) + '] ' + err.name;

      if (err.fileName) {
        message += ' in ' + path.relative(process.cwd(), err.fileName) + ':' + chalk.bold(err.lineNumber);
      } else if (err.lineNumber) {
        message += ' at line ' + chalk.bold(err.lineNumber);
      }

      console.log(message);
      console.log(chalk.red(err.message));
    }
  },
  rename: {
    /* Rename files (used for revisioning) */
    enabled: false
  },
  watch: {
    /* Run build each time file is changed */
    enabled: true
  }
};
