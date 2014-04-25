# pho-devstack [![NPM version][npm-image]][npm-url]

## Status
This is an EXPERIMENTAL SOFTWARE! Use it at your own risk. There will be BREAKING CHANGES and probably no documentation before 1.0, just installation instructions.


## Installation

1. Install [Node.js](http://nodejs.org/)
1. Run ```sudo npm install -g bower yo generator-pho gulp```


## Creating a new project

1. Create a project directory<br>
<code>mkdir <b>new-project</b> && cd $_</code>
1. Generate initial project structure<br>
```yo pho```


## Usage
1. Run build system ```gulp```
1. Open ```dist/index.html``` in your browser
1. Edit files in ```src/```, build will run automatically and page will be reloaded in browser(s)

When you're finished, press ```Ctrl + C``` to quit build system.

## License

[MIT license](http://opensource.org/licenses/mit-license.php)

[npm-url]: https://npmjs.org/package/pho-devstack
[npm-image]: https://badge.fury.io/js/pho-devstack.png
