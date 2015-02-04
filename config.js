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
    scriptMain: 'main.js',
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
      "browserify-ngmin": false, // DEPRECATED: rewrite AngularJS code to be minification-proof
      uglifyify: false           // DEPRECATED: minifies module with UglifyJS
    }
  },
  clean: {
    /* Clean folder before generating build output (useful for folders with revisioned files) */
    enabled: true
  },
  copy: [
    /* List of folders that will be copied to dist folder */
    // example: 'images/sprites/**/*', 'humans.txt', 'bower_components/jquery/dist/jquery.js'
  ],
  defaultDependencies: [
    /* Add custom tasks to run as dependencies to the `default` task */
    // Put here task names for tasks that are executed once after launching Gulp
    // Related: indexDependencies
  ],
  filter: {
    /* Used internally for generating sprites */
    enabled: true
  },
  htmlmin: {
    /* Markup minification */
    /* Option list: https://github.com/kangax/html-minifier#options-quick-reference */
    enabled: true,
    collapseWhitespace: true, // remove whitespace characters from text nodes and document tree
    removeComments: true,     // strip HTML comments
    keepClosingSlash: true    // keep the trailing slash on singleton elements - SVG doesn't break with this is enabled
  },
  imagemin: {
    /* Minify PNG, JPEG, GIF and SVG images */
    enabled: false // temporarily disabled (unreliable plugin)
  },
  indexDependencies: [
    /* Add custom tasks to run as dependencies to the `index` task */
    // Task names for tasks that are executed in every incremental build (after file save) should go here
    // Related: defaultDependencies
  ],
  jshint: {
    enabled: false
  },
  jscs: {
    enabled: false
  },
  karma: {
    /* Test runner for JavaScript */
    // configure it in karma.conf.js
    enabled: false
  },
  less: {
    /* Less style file compilation */
    enabled: true,
    compress: true, // remove whitespace from CSS
    paths: [        // directories for locating Less files
      'src/styles/',
      'src/bower_components/'
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
  ngAnnotate: {
    enabled: false
  },
  plumber: {
    /* Handle errors in a way that Gulp doesn't crash */
    enabled: true,
    errorHandler: function(err, plugin) { // custom error message output
      var beep = '\x07';
      var message = beep + '[' + chalk.magenta(plugin || err.plugin) + '] ' + err.name;

      if (err.fileName) {
        message += ' in ' + path.relative(process.cwd(), err.fileName) + ':' + chalk.bold(err.lineNumber);
      } else if (err.lineNumber) {
        message += ' at line ' + chalk.bold(err.lineNumber);
      }

      console.log(message);
      if(plugin == "browserify") {
        console.log(err);
      } else {
        console.log(chalk.red(err.message));
      }
    }
  },
  rename: {
    /* Rename files (used for revisioning) */
    enabled: false
  },
  sourcemaps: {
    enabled: true,
    loadMaps: true
  },
  spritesPreprocessor: {
    /* Replace images in sprites folder with one image, and change css paths */
    enabled: false,
    path: 'src/images/sprites/',         // path to the source image files
    prefix: '../images/sprites/',        // CSS prefix in image url to know what images transform into sprites
    name: '../images/sprites/sprite.png' // name of the output sprite file
  },
  substituter: {
    /* Replace any text in markup with specified value */
    enabled: true
  },
  uglify: {
    enabled: false,
    compress: false
  },
  watch: {
    /* Run build each time file is changed */
    enabled: true
  }
};
