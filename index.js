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
var karma = require('karma');
var path = require('path');
var spawn = require('child_process').spawn;
var imagemin = require('gulp-imagemin');

var extend = require('node.extend');
var defaultConfig = require('./config');

var gulpLog = function(text) {
  console.log('[\x1B[32m' + 'gulp' + '\x1B[39m] ' + text);
};

module.exports = function(gulp, userConfig) {
  var config = extend(true, {}, defaultConfig, userConfig);

  gulp.task('lrServer', function(cb) {
    lrServer.listen(35729, cb);
  });

  gulp.task('dist-clean', function(cb) {
    gulp.src([
      path.join(config.dist.scriptDir, config.dist.scriptFiles),
      path.join(config.dist.styleDir, config.dist.styleFiles),
      path.join(config.dist.imageDir, config.src.imageFiles)
    ], { read: false })
      .pipe(clean())
      .on('end', cb);
  });

  gulp.task('scripts', ['dist-clean'], function(cb) {
    gulp.src(path.join(config.src.scriptDir, config.src.scriptMain))
      .pipe(plumber(config.plumber))
      .pipe(browserify(config.browserify))
      .pipe(rev())
      .pipe(gulp.dest(config.dist.scriptDir))
      .on('end', cb);
  });

  gulp.task('styles', ['dist-clean'], function(cb) {
    gulp.src(path.join(config.src.styleDir, config.src.styleMain))
      .pipe(plumber(config.plumber))
      .pipe(less(config.less))
      .pipe(rev())
      .pipe(gulp.dest(config.dist.styleDir))
      .on('end', cb);
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
      .pipe(refresh(lrServer))
      .on('end', cb);
  });

  gulp.task('default', ['index', 'lrServer'], function() {
    gulp.watch([
      path.join(config.src.markupDir, config.src.markupFiles),
      path.join(config.src.scriptDir, config.src.scriptFiles),
      path.join(config.src.styleDir, config.src.styleFiles),
      path.join(config.src.specDir, config.src.specFiles),
      path.join(config.src.imageDir, config.src.imageFiles)
    ], ['index']);

    karma.server.start({ configFile: path.join(process.cwd(), 'karma.conf.js'), singleRun: false, autoWatch: true }, process.exit);
  });

  gulp.task('images', ['dist-clean'], function() {
    gulp.src(path.join(config.src.imageDir, config.src.imageFiles))
      .pipe(imagemin())
      .pipe(gulp.dest('dist/images'));
  });

  gulp.task('test', ['index'], function() {
    karma.server.start({ configFile: path.join(process.cwd(), 'karma.conf.js'), singleRun: true, autoWatch: false }, process.exit);
  });

  gulp.task('e2e', ['index'], function() {
    var testPath = path.join(config.src.specDir, config.src.integrationDir);

    var casper = spawn(path.join(__dirname, 'node_modules/casperjs/bin/casperjs'), ['test', testPath]);

    casper.stdout.on('data', function(data) {
      gulpLog('CasperJS: ' + data.toString().slice(0, -1));
    });

    casper.stdout.on('close', process.exit);
  });
};
