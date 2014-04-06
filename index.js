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

var extend = require('node.extend');
var karma = require('karma');
var path = require('path');
var spawn = require('child_process').spawn;

var defaultConfig = require('./config');

var chalk = require('chalk');

var gulpLog = function(text) {
  console.log('[' + chalk.green('gulp') + '] ' + text);
};

module.exports = function(gulp, userConfig) {
  var config = extend(true, {}, defaultConfig, userConfig);

  var lrServer;
  var scriptsChanged = true;
  var stylesChanged = true;

  gulp.task('lrServer', function(cb) {
    lrServer = livereload();
    cb();
  });

  gulp.task('scripts', function(cb) {
    if (!scriptsChanged) { return cb(); }

    scriptsChanged = false;

    gulp.src([path.join(config.dist.scriptDir, config.dist.scriptFiles)], {read: false})
      .pipe(clean())
      .on('end', function() {
        gulp.src(path.join(config.src.scriptDir, config.src.scriptMain))
          .pipe(plumber(config.plumber))
          .pipe(browserify(config.browserify))
          .pipe(rev())
          .pipe(gulp.dest(config.dist.scriptDir))
          .on('end', cb);
      });
  });

  gulp.task('styles', function(cb) {
    if (!stylesChanged) { return cb(); }

    stylesChanged = false;

    gulp.src([path.join(config.dist.styleDir, config.dist.styleFiles)], {read: false})
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
    karma.server.start({ configFile: path.join(process.cwd(), 'karma.conf.js'), singleRun: true, autoWatch: false }, process.exit);
  });

  gulp.task('testContinous', ['index'], function() {
    karma.server.start({ configFile: path.join(process.cwd(), 'karma.conf.js'), singleRun: false, autoWatch: true }, process.exit);
  });

  gulp.task('e2e', ['index'], function() {
    var testPath = path.join(config.src.specDir, config.src.integrationDir);
    var casper = spawn(path.join(__dirname, 'node_modules/casperjs/bin/casperjs'), ['test', testPath]);

    casper.stdout.on('data', function(data) {
      gulpLog('CasperJS: ' + data.toString().slice(0, -1));
    });

    casper.stdout.on('close', process.exit);
  });

  gulp.task('default', ['lrServer', 'index', 'testContinous'], function() {
    gulp.watch([path.join(config.dist.markupDir, config.src.markupFiles)], function(file) {
      lrServer.changed(file.path);
    });

    gulp.watch([path.join(config.src.scriptDir, config.src.scriptFiles)], ['index'])
      .on('change', function() {
        scriptsChanged = true;
      });

    gulp.watch([path.join(config.src.styleDir, config.src.styleFiles)], ['index'])
      .on('change', function() {
        stylesChanged = true;
      });

    gulp.watch([
      path.join(config.src.markupDir, config.src.markupFiles),
      path.join(config.src.specDir, config.src.specFiles),
      path.join(config.src.imageDir, config.src.imageFiles)
    ], ['index']);
  });
};
