## Status
This is an EXPERIMENTAL SOFTWARE! Use it at your own risk. There will be BREAKING CHANGES and probably no documentation before 1.0, just installation instructions.

## Installation

1. Install Node.js and run ```npm install -g gulp && npm install pho-devstack```
2. Install LiveReload Chrome extension https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
3. Add ```Gulpfile.js``` to your project root (you may need to alter path settings to match your project, see [default config file](https://github.com/madebysource/pho-devstack/blob/master/config.js] for all options). Your ```Gulpfile.js``` may look like this:

```javascript
var gulp = require('gulp');
require('pho-devstack')(gulp, {
  browserify: {
    enabled: true
  }
});
```

## Usage

1. Run ```gulp```
2. Open ```dist/index.html``` in Chrome
3. Enable LiveReload in the extension
4. Edit files in ```src/```, build will run automatically and page will be updated in Chrome.

## License

[MIT license](http://opensource.org/licenses/mit-license.php)