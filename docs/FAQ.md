# Frequently asked questions

## How do I change directory with sources?
Change it in your gulpfile. See [Configuration guide](configuration.md) for details.

## My project is big. Will it affect my build time?

This is common issue for developers who use Browserify. Phở uses [watchify](https://github.com/substack/watchify) that recompiles only changed modules (not whole bundle).

Time consuming operations like minification of JavaScript code and sprite generation are enabled only in production mode.

## Why Phở doesn't run any server in development mode?

There are 3 ways to run your application:

1. Directly from file system
1. Launching a web server from project directory - just run ```python -m SimpleHTTPServer``` and open page from shown port (usually `http://localhost:8000/dist/`).
1. Using backend platform of your choice and serving pages from it. Reloading pages will still work.

## Can I write my own Gulp tasks or customize Phở's tasks?
Absolutely! Put your new tasks in your gulpfile. You can rewrite Phở's tasks if you give them same name.

<!--## Can I write my own npm module as Phở extension?-->

## Where can I get updates on Phở

You can find news about Phở, helpful links and product updates at [Source Facebook page](https://www.facebook.com/madebysource) or [follow @MadeBySource at Twitter](https://twitter.com/MadeBySource).