'use strict';

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject');
var less = require('gulp-less');
var lrServer = require('tiny-lr')();
var plumber = require('gulp-plumber');
var refresh = require('gulp-livereload');
var rev = require('gulp-rev');
var jasmine = require('gulp-jasmine');

var extend = require('node.extend');
var defaultConfig = require('./config');
module.exports = function(gulp, userConfig) {
  var config = extend(true, {}, defaultConfig, userConfig);

  gulp.task('lrServer', function(cb) {
    lrServer.listen(35729, cb);
  });

  gulp.task('dist-clean', function(cb) {
    gulp.src([
      config.dist.scriptDir + config.dist.scriptFiles,
      config.dist.styleDir + config.dist.styleFiles
    ], { read: false })
      .pipe(clean())
      .on('end', cb);
  });

  gulp.task('scripts', ['dist-clean'], function(cb) {
    gulp.src(config.src.scriptDir + config.src.scriptMain)
      .pipe(plumber(config.plumber))
      .pipe(browserify(config.browserify))
      .pipe(rev())
      .pipe(gulp.dest(config.dist.scriptDir))
      .on('end', cb);
  });

  gulp.task('styles', ['dist-clean'], function(cb) {
    gulp.src(config.src.styleDir + config.src.styleMain)
      .pipe(plumber(config.plumber))
      .pipe(less(config.less))
      .pipe(rev())
      .pipe(gulp.dest(config.dist.styleDir))
      .on('end', cb);
  });

  gulp.task('index', ['scripts', 'styles'], function(cb) {
    gulp.src([
      config.dist.scriptDir + config.dist.scriptFiles,
      config.dist.styleDir + config.dist.styleFiles
    ], { read: false })
      .pipe(plumber(config.plumber))
      .pipe(inject(config.src.markupDir + config.src.markupMain, config.inject))
      .pipe(htmlmin(config.htmlmin))
      .pipe(gulp.dest('dist'))
      .pipe(refresh(lrServer))
      .on('end', cb);
  });

  gulp.task('default', ['index', 'lrServer'], function() {
    gulp.watch([
      config.src.markupDir + config.src.markupFiles,
      config.src.scriptDir + config.src.scriptFiles,
      config.src.styleDir + config.src.styleFiles
    ], ['index']);
  });

  gulp.task('test', function() {
    gulp.src(config.src.specDir + config.src.specFiles).pipe(jasmine());
  });
};
