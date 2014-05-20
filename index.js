'use strict';

var extend = require('node.extend');
var es = require('event-stream');
var path = require('path');
var through = require('through2');
var vinylSourceStream = require('vinyl-source-stream');
var chalk = require('chalk');

// we later iterate through this plugin object, plugin lazy loading has to be disabled
var $ = require('gulp-load-plugins')({
  config: require.resolve('./package.json'),
  lazy: false,
  pattern: ['gulp-*', 'sprites-preprocessor']
});

var stylish = require('jshint-stylish');

var defaultConfig = require('./config');
var testRunner = require('./lib/test-runner');

var Cache = require('./cache');
var files = require('./lib/get-files');

module.exports = function(gulp, userConfig) {
  var originalConfig = extend(true, {}, defaultConfig, userConfig);
  var config = extend(true, {}, originalConfig);

  var cache = new Cache();

  var getFolders = function(base, folders) {
    return gulp.src(folders.map(function(item) {
      return path.join(base, item);
    }), { base: base });
  };

  var isPluginEnabled = function(name) {
    return originalConfig[name] && originalConfig[name].enabled;
  };

  var handleError = function(err, name) {
    if (isPluginEnabled('plumber')) {
      config.plumber.errorHandler(err, name);
    } else {
      throw err;
    }
  };

  // remove "enabled" key from config
  for (var configName in config) {
    if (config.hasOwnProperty(configName) && config[configName].hasOwnProperty('enabled')) {
      delete config[configName].enabled;
    }
  }

  var cdn = config.substituter.cdn || '';
  // setup gulp-substituter js and css keys
  if (config.substituter) {
    if (!config.substituter.js) {
      config.substituter.js = function() {
        return files(path.join(config.dist.scriptDir, config.dist.scriptFiles), function(name) {
          return '<script src="' + path.join(cdn, 'scripts', name) + '"></script>';
        });
      };
    }

    if (!config.substituter.css) {
      config.substituter.css = function() {
        return files(path.join(config.dist.styleDir, config.dist.styleFiles), function(name) {
          return '<link rel="stylesheet" href="' + path.join(cdn, 'styles', name) + '">';
        });
      };
    }
  }

  // disabled gulp plugins are replaced with stream that passes everything through
  for (var pluginName in $) {
    if ($.hasOwnProperty(pluginName)) {
      if (!isPluginEnabled(pluginName)) {
        $[pluginName] = through.obj;
      }
    }
  }

  var browserify = isPluginEnabled('watch') ? require('watchify') : require('browserify');
  var bundler = browserify('./' + path.join(config.src.scriptDir, config.src.scriptMain));

  // apply browserify transforms from config
  for (var transform in config.browserify.transforms) {
    if (config.browserify.transforms.hasOwnProperty(transform) && config.browserify.transforms[transform]) {
      bundler.transform(transform);
    }
  }

  // every task calls cb to measure its execution time
  gulp.task('scripts', ['jshint'], function(cb) {
    if (cache.isClean('scripts')) { return cb(); }
    cache.setClean('scripts');

    gulp.src(path.join(config.dist.scriptDir, config.dist.scriptFiles), { read: false })
      .pipe($.clean())
      .on('end', function() {
        bundler.bundle(config.browserify)
          .on('error', function(err) {
            handleError(err, 'browserify');
            cb();
          })
          .pipe(vinylSourceStream(config.src.scriptMain))
          .pipe($.plumber(config.plumber))
          .pipe($.rename({ suffix: '-' + Date.now().toString() }))
          .pipe(gulp.dest(config.dist.scriptDir))
          .on('end', cb);
      });
  });

  gulp.task('jshint', function() {
    if (!isPluginEnabled('jshint')) { return; }

    return gulp.src(path.join(config.src.scriptDir, config.src.scriptFiles))
      .pipe($.jshint(config.src.jshint))
      .pipe($.jshint.reporter(stylish));
  });

  gulp.task('styles', function(cb) {
    if (cache.isClean('styles')) { return cb(); }
    cache.setClean('styles');

    var spriteFilter = $.filter('**/*.png');
    var cssFilter = $.filter('**/*.css');

    gulp.src(path.join(config.dist.styleDir, config.dist.styleFiles), { read: false })
      .pipe($.clean())
      .on('end', function() {
        gulp.src(path.join(config.src.styleDir, config.src.styleMain))
          .pipe($.plumber(config.plumber))
          .pipe($.less(config.less))
          .pipe($.base64(config.base64))

          .pipe($.spritesPreprocessor(config.spritesPreprocessor))
          .pipe(spriteFilter)
          .pipe(gulp.dest(config.dist.spriteDir))
          .pipe(spriteFilter.restore())

          .pipe(cssFilter)
          .pipe($.rename({ suffix: '-' + Date.now().toString() }))
          .pipe(gulp.dest(config.dist.styleDir))
          .on('end', cb);
      });
  });

  gulp.task('index', ['scripts', 'styles', 'images'], function() {
    var streams = [];

    if (cache.isDirty('markups') || isPluginEnabled('rename')) {
      cache.setClean('markups');

      var markupStream = gulp.src(path.join(config.src.markupDir, config.src.markupFiles))
        .pipe($.plumber(config.plumber))
        .pipe($.substituter(config.substituter))
        .pipe($.htmlmin(config.htmlmin));

      streams.push(markupStream);
    }

    if (config.copy.length) {
      streams.push(getFolders('src', config.copy));
    }

    if (streams.length) {
      return es.merge.apply(null, streams).pipe(gulp.dest('dist'));
    }
  });

  gulp.task('images', function() {
    return gulp.src(path.join(config.src.imageDir, '**/*'))
      .pipe($.plumber(config.plumber))
      .pipe($.newer(config.dist.imageDir))
      .pipe($.imagemin(config.imagemin))
      .pipe(gulp.dest(config.dist.imageDir));
  });

  gulp.task('test', ['index'], function() {
    if (isPluginEnabled('karma')) {
      testRunner.karma();
    }
  });

  gulp.task('testContinuous', ['index'], function() {
    if (isPluginEnabled('karma')) {
      testRunner.karmaWatch();
    }
  });

  gulp.task('e2e', ['index'], function() {
    if (isPluginEnabled('e2e')) {
      testRunner.casper(path.join(config.src.specDir, config.src.e2eDir));
    }
  });

  gulp.task('default', ['index', 'testContinuous'], function() {
    if (!isPluginEnabled('watch')) { return; }

    // watchify has its own watcher
    bundler.on('update', function() {
      cache.setDirty('scripts');
      gulp.start('index');
    });

    gulp.watch(path.join(config.src.styleDir, config.src.styleFiles), ['index'])
      .on('change', function() {
        cache.setDirty('styles');
      });

    gulp.watch(path.join(config.src.markupDir, config.src.markupFiles), ['index'])
      .on('change', function() {
        cache.setDirty('markups');
      });

    gulp.watch([
      path.join(config.src.specDir, config.src.specFiles),
      path.join(config.src.imageDir, '**/*')
    ], ['index']);

    if (!isPluginEnabled('livereload')) {
      var liveReloadServer = $.livereload();

      var liveReloadHandler = function(file) {
        liveReloadServer.changed(file.path);
        console.log('[' + chalk.blue('Reload') + '] ' + file.path);
      };

      gulp.watch(path.join(config.dist.markupDir, config.dist.markupFiles), liveReloadHandler);

      if (!isPluginEnabled('rename')) {
        // markup is not changed when rename is disabled, we can livereload
        gulp.watch([
          path.join(config.dist.scriptDir, config.dist.scriptFiles),
          path.join(config.dist.styleDir, config.dist.styleFiles)
        ], liveReloadHandler);
      }
    }
  });
};
