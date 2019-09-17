# Phở Devstack [![NPM version][npm-image]][npm-url]

> Automated workflow for front-end developers in one tasty bowl of code.

## Status

This software is **ARCHIVED**. No new development is going on. Feel free to fork it. We've used this dev stack in [Source][Source] for all new landing pages and in [abdoc][Abdoc] for all new client projects since February 2014.

As replacement you can use Webpack-based dev stack like [create-react-app](https://create-react-app.dev/). Webpack practically replaced Gulp-based dev stacks and offers more features (at cost of worse performance).

## Features

- Yeoman [generator](https://github.com/madebysource/generator-pho)
- Livereload (without browser reload for CSS)
- Sass and Less stylesheets compilation
- HTML, JavaScript and CSS minification
- Advanced image handling (base64 inlining, image optimization, sprite generation)
- Browserify modules (written in JavaScript or CoffeeScript)
- Linting JavaScript
- Configurable directory structure
- Replacing text in HTML (meta tags, analytics codes)
- Scripts and stylesheets revisioning
- Running build after file is changed
- Configurable plugins
- Stays up-to-date

## Installation

Run ```npm install -g gulp yo generator-pho```

*Phở Devstack uses [Gulp][Gulp] as task runner, [Yeoman][Yeoman] for scaffolding new projects and [Bower][Bower] for installing client-side packages.*

*Learn more about installing Phở at [Getting Started guide](docs/getting-started.md)*

## Documentation

For a Getting Started guide, FAQ, etc. see [documentation](docs/README.md).

## Want to contribute?

See our [Contributing guide](CONTRIBUTING.md)

## License

[MIT license](http://opensource.org/licenses/mit-license.php)

[npm-url]:  https://npmjs.org/package/pho-devstack
[npm-image]: http://img.shields.io/npm/v/pho-devstack.svg?style=flat

[Gulp]: http://gulpjs.com/
[Yeoman]: http://yeoman.io/
[Bower]: http://bower.io/
[Source]: https://madebysource.com/
[Abdoc]: http://abdoc.net/
