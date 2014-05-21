# Getting Started

<!--After this walkthrough you will be able to use Phở Devstack with new or existing projects.-->

## Installation

1. Install [Node.js](http://nodejs.org/)
1. Run ```sudo npm install -g gulp yo generator-pho bower```

*Phở Devstack uses [Gulp][Gulp] as task runner, [Yeoman][Yeoman] for scaffolding new projects and [Bower][Bower] for installing client-side packages*

## Creating a new project

1. Create a project directory<br>
<code>mkdir <b>new-project</b> && cd $_</code>
1. Generate initial project structure<br>
```yo pho```

You project directory will look like this:

- `.bowerrc`       - config file that tells [Bower][Bower] where to install packages
- `.editorconfig` - [EditorConfig][EditorConfig] sets consistent coding styles between different editors
- `.gitignore`    - files that should not be commited to Git
- `.jshintrc`     - JSHint [settings][JsHint] for detecting possible problems in your JavaScript sources
- `dist`         - folder where generated files are placed (do not edit files here)
- `gulpfile-production.js` - settings for production mode of Phở Devstack
- `gulpfile.js`    - settings for development mode of Phở Devstack
- `node_modules`   - folder where [npm][npm] packages like gulp or pho-devstack are installed
- `package.json`   - file that specifies which packages should [npm][npm] install
- `src`          - folder with source files (write your code here)
	- `bower_components` - folder where [Bower][Bower] like lesshat are installed
	- `images`       - folder containing images
		- `sprites`      - images for [sprites-preprocessor][sprites-preprocessor]
	- `index.html`   - main markup file
	- `scripts`      - folder with JavaScript code
	- `styles`       - folder containing stylesheets
- `substitute-config.js` - settings for [substituter][substituter], e.g. Analytics ID, project description

<!--## Setting up Phở for existing project

1. Run ```npm install pho-devstack gulp@3.6.0```
1. Create ```Gulpfile.js``` that uses default Phở config
1. Change config to match your project. It will probably have different directory structure.-->

## Usage
1. Run build system ```gulp```
1. Open ```dist/index.html``` in your browser
1. Edit files in ```src/```, build will run automatically and page will be reloaded in browser(s)

When you're finished, press ```Ctrl + C``` to quit build system.

For a production build, run ```gulp --gulpfile gulpfile-production.js```. You can use this command in your CI or deploy script.

## More information

Now you've created a new project or set up Phở for existing project. With default options you should be able to do fairly much work, but every plugin that is included in Phở is customizable and can be turned off.

For information about configuring Phở see [Configuration](configuration.md). For answers to some common questing see [FAQ](FAQ.md).

[Gulp]: http://gulpjs.com/
[Yeoman]: http://yeoman.io/
[Bower]: http://bower.io/
[EditorConfig]: http://editorconfig.org
[JsHint]: http://www.jshint.com/docs/options/
[substituter]: https://github.com/madebysource/gulp-substituter
[sprites-preprocessor]: https://github.com/madebysource/sprites-preprocessor
[npm]: https://www.npmjs.org/