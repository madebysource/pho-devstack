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
    spriteDir: 'dist/images/sprites/',
    markupFiles: '**/*.html',
    scriptFiles: '*.js',
    styleFiles: '*.css'
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
    specFiles: '**/*Spec.js'
  },
  base64: {
    enabled: false,
    maxImageSize: 32768 // maximum filesize for replacing image with base64
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
  substituter: {
    /* Replace any text in markup with specified value */
    enabled: true
  },
  filter: {
    /* Used internally for generating sprites */
    enabled: true
  },
  htmlmin: {
    /* Markup minification */
    /* Option list: https://github.com/kangax/html-minifier#options-quick-reference */
    enabled: true,
    collapseWhitespace: true, // remove whitespace characters from text nodes and document tree
    removeComments: true      // strip HTML comments
  },
  jshint: {
    enabled: false
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
  spritesPreprocessor: {
    /* Replace images in sprites folder with one image, and change css paths */
    enabled: false,
    path: 'src/images/sprites/',
    prefix: '../images/sprites/',
    name: '../images/sprites/sprite.png'
  },
  watch: {
    /* Run build each time file is changed */
    enabled: true
  }
};
