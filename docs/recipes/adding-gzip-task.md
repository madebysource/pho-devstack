# GZip dist gulp task

Servers are able to gzip files on the fly, but most of them can also serve "pre-gziped" files and thus avoid any CPU usage in runtime associated with the task. For instance, you can configure nginx to do so.

This recipe makes gzipped versions of all files in `dist` folder

1. Install [gulp-gzip](https://www.npmjs.org/package/gulp-gzip) <br>
  `npm install gulp-gzip --save-dev`

2. Add the following code to your Gulpfile:

```javascript
var gzip = require('gulp-gzip');

gulp.task('gzip', ['index'], function(cb) {
  gulp.src('./dist/**')
    .pipe(gzip({
      append: true,
      level: 9
    }))
    .pipe(gulp.dest('dist'))
    .on('end', cb);
  });
```

3. Run the new task <br>
  `gulp gzip`
