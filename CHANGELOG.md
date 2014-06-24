<a name="1.4.0"></a>
# 1.4.0 Jan's Phở (2014-06-24)

- Minor Browserify implementation changes to support transpilers such as CoffeeScript
- Bump gulp-substituter (has recursive partial substitution)
- Bump gulp-livereload for cleaner code
- Remove yargs (unused)
- Replace event-stream with merge-stream (It has less dependencies.)
- Highlight plugin name in errors

<a name="1.3.0"></a>
# 1.3.0 Gita's Phở (2014-06-10)

- Remove Less Hat from include path
- Export config and tasks from pho-devstack module
- Add ability to add custom tasks as dependency to the default task

<a name="1.2.0"></a>
# 1.2.0 Dalibor's Phở (2014-06-04)

- Remove hardcoded directories in copy plugin
- Add bower_components to Less include_path

<a name="1.1.0"></a>
# 1.1.0 Valdemar's Phở (2014-05-26)

- Add ability to specify custom dependencies for index task

<a name="1.0.1"></a>
# 1.0.1 Filip's Phở (2014-05-26)

- Don't copy html files from bower_components

<a name="1.0.0"></a>
# 1.0.0 Emil's Phở (2014-05-22)

- Add JSCS - JavaScript code style checker

<a name="1.0.0-beta.2"></a>
# 1.0.0-beta-2 Monika's Phở (2014-05-21)

- Fix CDN substituter (one / was missing after http)

<a name="1.0.0-beta.1"></a>
# 1.0.0-beta.1 Bernard's Phở (2014-05-20)

- Testing and writing documentation
- Add CDN option to js and css substituter
- Add JSHint (disabled by default)
- Run image folder through image task for copying

<a name="1.0.0-alpha.1"></a>
# 1.0.0-alpha.1 Přemysl's Phở (2014-05-16)

- BREAKING CHANGE: gulp-fileInsert replaced with substituter (markup files need update - see [new syntax][generator-index-1.0.0-alpha.1])
- BREAKING CHANGE: gulp-inject replaced with substituter (markup files need update - see [new syntax][generator-index-1.0.0-alpha.1])
- Add gulp-base64 for inlining small images into CSS file
- Add sprites-preprocessor for generating sprites
- Big cleanup

[generator-index-1.0.0-alpha.1]: https://github.com/madebysource/generator-pho/blob/af917b1d96d22981fe7e2ad6a0ad13e37fcd3162/app/templates/src/index.html

<a name="0.3.1"></a>
# 0.3.1 Marek's Phở (2014-04-25)

- Fix gulp-fileInsert not working on every next run in development mode

<a name="0.3.0"></a>
# 0.3.0 Jirka's Phở (2014-04-24)

- Injecting file contents into markup
- Smarter index task - executing only when needed
- Fixed rename suffix not beeing unique for each build

<a name="0.2.3"></a>
# 0.2.3 Vojta's Phở (2014-04-23)

- Livereload CSS without whole page reload (rename plugin must be disabled)

<a name="0.2.2"></a>
# 0.2.2 Valérie's Phở (2014-04-18)

- Handle multiple HTML files
- Fix browserify/watchify error handling

<a name="0.2.1"></a>
# 0.2.1 Irena's Phở (2014-04-16)

- Option to disable file watching
- Options for browserify transforms

<a name="0.2.0"></a>
# 0.2.0 Honza's Phở (2014-04-11)

- Add watchify for faster incremental JS builds

<a name="0.1.0"></a>
# 0.1.0 Petr's Phở (2014-04-10)

- Initial release