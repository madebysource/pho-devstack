'use strict';

var browserify = require('browserify');
var del = require('del');
var extend = require('node.extend');
var mergeStream = require('merge-stream');
var path = require('path');
var stylish = require('jshint-stylish');
var through = require('through2');
var vinylBuffer = require('vinyl-buffer');
var vinylSourceStream = require('vinyl-source-stream');

// we later iterate through this plugin object, plugin lazy loading has to be disabled
var $ = require('gulp-load-plugins')({
  config: require.resolve('./package.json'),
  lazy: false
});

var defaultConfig = require('./config');

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

  // start livereload server early
  if (isPluginEnabled('livereload'))
    $.livereload.listen(config.livereload.port);

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

  config.browserify.entries = './' + path.join(config.src.scriptDir, config.src.scriptMain);
  var bundler = browserify(config.browserify);
  if (isPluginEnabled('watch')) {
    var watchify = require('watchify');
    bundler = watchify(bundler);
  }

  // apply browserify transforms from config
  // hack with Array.prototype.reverse() is used, because V8 iterates over objects in reversed order
  // https://code.google.com/p/v8/issues/detail?id=164
  Object.keys(config.browserify.transforms).reverse().forEach(function (transform) {
    if (config.browserify.transforms[transform])
      bundler.transform(transform);
  });

  var scriptsDependencies = [];
  if (isPluginEnabled('jshint'))
    scriptsDependencies.push('jshint');

  if (isPluginEnabled('jscs'))
    scriptsDependencies.push('jscs');

  gulp.task('scripts', scriptsDependencies, function(cb) {
    if (cache.isClean('scripts')) { return cb(); }
    cache.setClean('scripts');

    del(path.join(config.dist.scriptDir, config.dist.scriptFiles), function () {
      bundler.bundle()
        .on('error', function(err) {
          handleError(err, 'browserify');
          cb();
        })
        .pipe(vinylSourceStream(config.dist.scriptMain))
        .pipe($.plumber(config.plumber))
        .pipe(vinylBuffer())
        .pipe($.sourcemaps.init(config.sourcemaps))

        .pipe($.ngAnnotate(config.ngAnnotate))
        .pipe($.uglify(config.uglify))

        .pipe($.sourcemaps.write('./'))
        .pipe($.rename(isPluginEnabled('rename') && function (path) {
          if (path.extname !== '.map')
            path.basename += '-' + Date.now().toString();
        }))
        .pipe(gulp.dest(config.dist.scriptDir))
        .on('end', cb);
    });
  });

  gulp.task('jshint', function() {
    return gulp.src(path.join(config.src.scriptDir, '**/*.js'))
      .pipe($.jshint(config.src.jshint))
      .pipe($.jshint.reporter(stylish));
  });

  gulp.task('jscs', function(cb) {
    return gulp.src(path.join(config.src.scriptDir, '**/*.js'))
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

    del(path.join(config.dist.styleDir, config.dist.styleFiles), function () {
      gulp.src(path.join(config.src.styleDir, config.src.styleMain))
        .pipe($.plumber(config.plumber))
        .pipe($.sourcemaps.init(config.sourcemaps))
        .pipe($.less(config.less))
        .pipe($.base64(config.base64))
        .pipe($.minifyCss(config.minifyCss))

        .pipe($.spritesPreprocessor(config.spritesPreprocessor))
        .pipe(spriteFilter)
        .pipe(gulp.dest(config.dist.spriteDir))
        .pipe(spriteFilter.restore())

        .pipe(cssFilter)
        .pipe($.sourcemaps.write('./'))
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
      return mergeStream.apply(null, streams).pipe(gulp.dest(config.dist.markupDir));
    }
  });

  gulp.task('images', function() {
    return gulp.src([path.join(config.src.imageDir, '**/*'), '!' + path.join(config.src.imageDir, 'sprites/**/*')])
      .pipe($.plumber(config.plumber))
      .pipe($.newer(config.dist.imageDir))
      .pipe(gulp.dest(config.dist.imageDir));
  });

  var defaultDependencies = ['index'].concat(config.defaultDependencies);
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
      var server = $.livereload.listen(config.livereload.port);

      var onChange = function(e) {
        $.livereload.changed(e.path, server);
      };

      gulp.watch(path.join(config.dist.markupDir, config.dist.markupFiles))
        .on("change", onChange);

      if (!isPluginEnabled('rename')) {
        // markup is not changed when rename is disabled, we can livereload
        gulp.watch([
          path.join(config.dist.scriptDir, config.dist.scriptFiles),
          path.join(config.dist.styleDir, config.dist.styleFiles)
        ]).on("change", onChange);
      }
    }
  });

  return {
    $: $,
    cache: cache,
    config: config
  }
};
