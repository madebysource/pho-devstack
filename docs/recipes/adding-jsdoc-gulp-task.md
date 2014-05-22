# Adding jsdoc gulp task

[gulp-jsdoc](https://www.npmjs.org/package/gulp-jsdoc)

`npm install gulp-jsdoc --save-dev`

## Gulpfile

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
