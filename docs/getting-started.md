# Getting Started

After this walkthrough you will be able to use Phở Devstack with new or existing projects.

## Installation

1. Install [Node.js](http://nodejs.org/)
1. Run ```sudo npm install -g gulp yo generator-pho bower```

*Phở Devstack uses [Gulp][Gulp] as task runner, [Yeoman][Yeoman] for scaffolding new projects and [Bower][Bower] for installing client-side packages*

## Creating a new project

1. Create a project directory<br>
<code>mkdir <b>new-project</b> && cd $_</code>
1. Generate initial project structure with [Yeoman][Yeoman]<br>
```yo pho```

## Setting up Phở for existing project


## Usage
1. Run build system ```gulp```
1. Open ```dist/index.html``` in your browser
1. Edit files in ```src/```, build will run automatically and page will be reloaded in browser(s)

When you're finished, press ```Ctrl + C``` to quit build system.

## More information

Now you've created a new project or set up Phở for existing project. With default options you should be able to do fairly much work, but every plugin that is included in Phở is customizable and can be turned off.

For information about configuring Phở see [Configuration](configuration.md). For answers to some common questing see [FAQ](FAQ.md).

[Gulp]: http://gulpjs.com/
[Yeoman]: http://yeoman.io/
[Bower]: http://bower.io/