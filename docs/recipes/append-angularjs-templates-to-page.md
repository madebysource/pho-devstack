# Add AngularJS templates to cache and inline it on page

This recipe assumes that your templates are in `src/templates`. It does a two-step substitution in order to achieve its goal, because it needs the Javascript and HTML to be minified with existing configurations, and then it inlines the generated template cache code. It also assumes that you have a module called `MY_MODULE_NAME`.


1. Install packages [gulp-substituter](https://www.npmjs.org/package/gulp-substituter) and [gulp-angular-templatecache](https://www.npmjs.org/package/gulp-angular-templatecache) package <br>
  ```
  npm install gulp-substituter --save-dev
  npm install gulp-angular-templatecache --save-dev
  ```

2. Add this code to your Gulpfile:

```javascript
var fs = require('fs');
var substituter = require('gulp-substituter');
var templateCache = require('gulp-angular-templatecache');

gulp.task('gzip', function(cb) {
  gulp.src('./dist/**')
    .pipe(gzip({
      append: true,
      level: 9
    }))
    .pipe(gulp.dest('dist'))
    .on('end', cb);
  });

gulp.task('templates', ['index'], function(cb) {
  gulp.src('./dist/templates/**/*.html')
    .pipe(templateCache('templates.js', {
      root: '/templates',
      module: 'MY_MODULE_NAME'
    }))
    .pipe(gulp.dest('dist/scripts'))
    .on('end', function() {
      gulp.src('./dist/index.html')
        .pipe(substituter({
          templates: function() {
            var templates = fs.readFileSync('dist/scripts/templates.js').toString()
              .replace(/<\/script>/g, '</scr" + "ipt>')
              .replace(/\n/g, '');
            return '<script type="text/javascript">' + templates + '</script>';
          },
          __start: '<',
          __end: '/>',
          __prefix: 'replace'
        }))
        .pipe(gulp.dest('dist'))
        .on('end', cb);
    });
});
```

3. Optionally, add the following to your Pho configuration <br>
  `defaultDependencies: ['templates']`

4. Add the following to your page, after loading AngularJS and your controllers <br>
  `<!-- substitute:templates -->`

5. Run the new task <br>
  `gulp templates`
