# Adding JSDoc gulp task

1. Install [gulp-jsdoc](https://www.npmjs.org/package/gulp-jsdoc) package <br>
  `npm install gulp-jsdoc --save-dev`

2. Add this code to your Gulpfile:

  ```javascript
  var jsdocOptions = {
  };

  gulp.task('jsdoc', function() {
    if (isPluginEnabled('jsdoc')) {
      return gulp.src(path.join('./src/scripts/**/*.js'))
        .pipe(jsdoc.parser(jsdocOptions, 'jsdoc.json'))
        .pipe(jsdoc.generator('./docs'));
    }
  });
  ```

3. Run JsDoc compilation <br>
  `gulp jsdoc`
