'use strict';

var chalk = require('chalk');
var extend = require('node.extend');
var es = require('event-stream');
var path = require('path');
var through = require('through2');
var vinylSourceStream = require('vinyl-source-stream');

// we later iterate through this plugin object, plugin lazy loading has to be disabled
var $ = require('gulp-load-plugins')({
  config: require.resolve('./package.json'),
  lazy: false
});

var stylish = require('jshint-stylish');

var defaultConfig = require('./config');
var testRunner = require('./lib/test-runner');

var Cache = require('./cache');
var files = require('./lib/get-files');

module.exports = function(gulp, userConfig) {
  var originalConfig = extend(true, {}, defaultConfig, userConfig);
  var config = extend(true, {}, originalConfig);

  var srcMarkupFiles = [
    path.join(config.src.markupDir, config.src.markupFiles),
    '!' + path.join(config.src.markupDir, '{bower_components,bower_components/**}')
  ];

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
          return '<script src="' + cdn + 'scripts/' + name + '"></script>';
        });
      };
    }

    if (!config.substituter.css) {
      config.substituter.css = function() {
        return files(path.join(config.dist.styleDir, config.dist.styleFiles), function(name) {
          return '<link rel="stylesheet" href="' + cdn + 'styles/' + name + '">';
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
  config.browserify.entries = './' + path.join(config.src.scriptDir, config.src.scriptMain);
  var bundler = browserify(config.browserify);

  // apply browserify transforms from config
  for (var transform in config.browserify.transforms) {
    if (config.browserify.transforms.hasOwnProperty(transform) && config.browserify.transforms[transform]) {
      bundler.transform(transform);
    }
  }

  var scriptsDependencies = [];
  if (isPluginEnabled('jshint'))
    scriptsDependencies.push('jshint');

  if (isPluginEnabled('jscs'))
    scriptsDependencies.push('jscs');

  gulp.task('scripts', scriptsDependencies, function(cb) {
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
          .pipe(vinylSourceStream(config.dist.scriptMain))
          .pipe($.plumber(config.plumber))
          .pipe($.rename({ suffix: '-' + Date.now().toString() }))
          .pipe(gulp.dest(config.dist.scriptDir))
          .on('end', cb);
      });
  });

  gulp.task('jshint', function() {
    return gulp.src(path.join(config.src.scriptDir, config.src.scriptFiles))
      .pipe($.jshint(config.src.jshint))
      .pipe($.jshint.reporter(stylish));
  });

  gulp.task('jscs', function(cb) {
    return gulp.src(path.join(config.src.scriptDir, config.src.scriptFiles))
      .pipe($.jscs())
      .on('error', function(err) {
        handleError(err);
        cb();
      });
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

  var indexDependencies = ['scripts', 'styles', 'images'].concat(config.indexDependencies);

  gulp.task('index', indexDependencies, function() {
    var streams = [];

    if (cache.isDirty('markups') || isPluginEnabled('rename')) {
      cache.setClean('markups');

      var markupStream = gulp.src(srcMarkupFiles)
        .pipe($.plumber(config.plumber))
        .pipe($.substituter(config.substituter))
        .pipe($.htmlmin(config.htmlmin));

      streams.push(markupStream);
    }

    if (config.copy.length) {
      streams.push(getFolders(config.src.markupDir, config.copy));
    }

    if (streams.length) {
      return es.merge.apply(null, streams).pipe(gulp.dest(config.dist.markupDir));
    }
  });

  gulp.task('images', function() {
    return gulp.src([path.join(config.src.imageDir, '**/*'), '!' + path.join(config.src.imageDir, 'sprites/**/*')])
      .pipe($.plumber(config.plumber))
      .pipe($.newer(config.dist.imageDir))
      .pipe($.imagemin(config.imagemin))
      .pipe(gulp.dest(config.dist.imageDir));
  });

  gulp.task('test', ['index'], function() {
    testRunner.karma();
  });

  gulp.task('testContinuous', ['index'], function() {
    testRunner.karmaWatch();
  });

  gulp.task('e2e', ['index'], function() {
    if (isPluginEnabled('e2e')) {
      testRunner.casper(path.join(config.src.specDir, config.src.e2eDir));
    }
  });

  var defaultDependencies = ['index'].concat(config.defaultDependencies);
  if (isPluginEnabled('karma')) {
    if (isPluginEnabled('watch'))
      defaultDependencies.push('testContinuous');
    else
      defaultDependencies.push('test');
  }
  gulp.task('default', defaultDependencies, function() {
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

    gulp.watch(srcMarkupFiles, ['index'])
      .on('change', function() {
        cache.setDirty('markups');
      });

    gulp.watch([
      path.join(config.src.specDir, config.src.specFiles),
      path.join(config.src.imageDir, '**/*')
    ], ['index']);

    if (isPluginEnabled('livereload')) {
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

  return {
    $: $,
    cache: cache,
    config: config
  }
};
