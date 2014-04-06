'use strict';

var gutil = require('gulp-util');
var path = require('path');

var argv = require('yargs').argv;
var extend = require('node.extend');

var plugins = require("gulp-load-plugins")({
  config: require.resolve('./package.json')
});

var defaultConfig = require('./config');
var testRunner = require('./test-runner');

module.exports = function(gulp, userConfig) {
  var config = extend(true, {}, defaultConfig, userConfig);

  var lrServer;
  var cleanFolders = {};

  var env = 'development';
  var envConfig = config.env[env];

  var plugin = function(name) {
    var pluginOption = envConfig[name];

    var pluginIsTurnedOff = pluginOption !== undefined && pluginOption !== null && !pluginOption;

    if (pluginIsTurnedOff) {
      return gutil.noop;
    } else {
      return plugins[name];
    }
  };

  gulp.task('lrServer', function(cb) {
    lrServer = plugin('livereload')();
    cb();
  });

  gulp.task('scripts', function(cb) {
    if (cleanFolders['scripts']) { return cb(); }

    cleanFolders['scripts'] = true;

    gulp.src(path.join(config.dist.scriptDir, config.dist.scriptFiles), { read: false })
      .pipe(plugin('clean')())
      .on('end', function() {
        gulp.src(path.join(config.src.scriptDir, config.src.scriptMain))
          .pipe(plugin('plumber')(config.plumber))
          .pipe(plugin('browserify')(config.browserify))
          .pipe(plugin('ngmin')())
          .pipe(plugin('uglify')(config.uglify))
          .pipe(plugin('rev')())
          .pipe(gulp.dest(config.dist.scriptDir))
          .on('end', cb);
      });
  });

  gulp.task('styles', function(cb) {
    if (cleanFolders['styles']) { return cb(); }

    cleanFolders['styles'] = true;

    gulp.src(path.join(config.dist.styleDir, config.dist.styleFiles), { read: false })
      .pipe(plugin('clean')())
      .on('end', function() {
        gulp.src(path.join(config.src.styleDir, config.src.styleMain))
          .pipe(plugin('plumber')(config.plumber))
          .pipe(plugin('less')(config.less))
          .pipe(plugin('rev')())
          .pipe(gulp.dest(config.dist.styleDir))
          .on('end', cb);
      });
  });

  gulp.task('index', ['scripts', 'styles', 'images'], function(cb) {
    gulp.src([
      path.join(config.dist.scriptDir, config.dist.scriptFiles),
      path.join(config.dist.styleDir, config.dist.styleFiles)
    ], { read: false })
      .pipe(plugin('plumber')(config.plumber))
      .pipe(plugin('inject')(path.join(config.src.markupDir, config.src.markupMain), config.inject))
      .pipe(plugin('htmlmin')(config.htmlmin))
      .pipe(gulp.dest('dist'))
      .on('end', cb);
  });

  gulp.task('images', function(cb) {
    gulp.src(path.join(config.src.imageDir, config.src.imageFiles))
      .pipe(plugin('plumber')(config.plumber))
      .pipe(plugin('newer')(config.dist.imageDir))
      .pipe(plugin('imagemin')())
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
    if (plugin('livereload')) {
      gulp.watch(path.join(config.dist.markupDir, config.src.markupFiles), function(file) {
        lrServer.changed(file.path);
      });
    }

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

  gulp.task('build', function() {
    env = argv.type || 'development';
    envConfig = config.env[env];

    gulp.start('index');
  });
};
