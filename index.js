'use strict';

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject');
var less = require('gulp-less');
var newer = require('gulp-newer');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var rev = require('gulp-rev');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');

var extend = require('node.extend');
var path = require('path');

var defaultConfig = require('./config');

var testRunner = require('./test-runner');

module.exports = function(gulp, userConfig) {
  var config = extend(true, {}, defaultConfig, userConfig);

  var lrServer;
  var cleanFolders = {};

  gulp.task('lrServer', function(cb) {
    lrServer = livereload();
    cb();
  });

  gulp.task('scripts', function(cb) {
    if (cleanFolders['scripts']) { return cb(); }

    cleanFolders['scripts'] = true;

    gulp.src(path.join(config.dist.scriptDir, config.dist.scriptFiles), { read: false })
      .pipe(clean())
      .on('end', function() {
        gulp.src(path.join(config.src.scriptDir, config.src.scriptMain))
          .pipe(plumber(config.plumber))
          .pipe(browserify(config.browserify))
          .pipe(ngmin())
          .pipe(uglify(config.uglify))
          .pipe(rev())
          .pipe(gulp.dest(config.dist.scriptDir))
          .on('end', cb);
      });
  });

  gulp.task('styles', function(cb) {
    if (cleanFolders['styles']) { return cb(); }

    cleanFolders['styles'] = true;

    gulp.src(path.join(config.dist.styleDir, config.dist.styleFiles), { read: false })
      .pipe(clean())
      .on('end', function() {
        gulp.src(path.join(config.src.styleDir, config.src.styleMain))
          .pipe(plumber(config.plumber))
          .pipe(less(config.less))
          .pipe(rev())
          .pipe(gulp.dest(config.dist.styleDir))
          .on('end', cb);
      });
  });

  gulp.task('index', ['scripts', 'styles', 'images'], function(cb) {
    gulp.src([
      path.join(config.dist.scriptDir, config.dist.scriptFiles),
      path.join(config.dist.styleDir, config.dist.styleFiles)
    ], { read: false })
      .pipe(plumber(config.plumber))
      .pipe(inject(path.join(config.src.markupDir, config.src.markupMain), config.inject))
      .pipe(htmlmin(config.htmlmin))
      .pipe(gulp.dest('dist'))
      .on('end', cb);
  });

  gulp.task('images', function(cb) {
    gulp.src(path.join(config.src.imageDir, config.src.imageFiles))
      .pipe(plumber(config.plumber))
      .pipe(newer(config.dist.imageDir))
      .pipe(imagemin())
      .pipe(gulp.dest(config.dist.imageDir))
      .on('end', cb);
  });

  gulp.task('test', ['index'], function() {
    testRunner.karma();
  });

  gulp.task('testContinuous', ['index'], function() {
    testRunner.karmaWatch();
  });

  gulp.task('e2e', ['index'], function() {
    testRunner.casper(path.join(config.src.specDir, config.src.e2eDir));
  });

  gulp.task('default', ['lrServer', 'index', 'testContinuous'], function() {
    gulp.watch(path.join(config.dist.markupDir, config.src.markupFiles), function(file) {
      lrServer.changed(file.path);
    });

    gulp.watch(path.join(config.src.scriptDir, config.src.scriptFiles), ['index'])
      .on('change', function() {
        cleanFolders['scripts'] = false;
      });

    gulp.watch(path.join(config.src.styleDir, config.src.styleFiles), ['index'])
      .on('change', function() {
        cleanFolders['styles'] = false;
      });

    gulp.watch([
      path.join(config.src.markupDir, config.src.markupFiles),
      path.join(config.src.specDir, config.src.specFiles),
      path.join(config.src.imageDir, config.src.imageFiles)
    ], ['index']);
  });
};
