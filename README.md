# Webpack Vinyl Entry

[![NPM](https://img.shields.io/npm/v/webpack-vinyl-entry.svg)](https://www.npmjs.com/package/webpack-vinyl-entry)
[![Build Status](https://travis-ci.org/dokmic/webpack-vinyl-entry.svg?branch=master)](https://travis-ci.org/dokmic/webpack-vinyl-entry)
[![Code Coverage](https://codecov.io/gh/dokmic/webpack-vinyl-entry/badge.svg?branch=master)](https://codecov.io/gh/dokmic/webpack-vinyl-entry?branch=master)

This JavaScript library provides gulp-like entry points in your webpack configuration.

## Install
```bash
npm install --save-dev webpack-vinyl-entry
```

## Usage
In your `webpack.config.js`:
```javascript
const Entry = require('webpack-vinyl-entry');

module.exports = {
  entry: new Entry({
    bundle1: Entry.src([
      '**/*.js',
      '!**/*.test.js',
      '!webpack.config.js'
    ]),
    bundle2: [
      'path/to/file1.js',
      'path/to/file2.js',
    ],
    pages: Entry.multi('src/pages', [
      'src/common.js',
      Entry.src([
        'src/components/**/index.js',
        'src/pages/**/index.js',
      ]),
    ]),
  }),

  // ...
};
```

This statement generates function wrapper over Promise that returns webpack compatible entry points. You can use whatever is accepted by webpack in the object values and besides that you can easly generate an entry from [gulpjs/vinyl-fs](https://github.com/gulpjs/vinyl-fs) globs by using `Entry.src`.

## API

### `Entry(entries)`
- `entries: Object` - Object of webpack compatible [entry points](https://webpack.js.org/concepts/entry-points/) or Promises.

Returns function wrapping Promise that resolves all the promises in `entries`.

### `Entry.src(globs)`
- `globs: Array` - Array of [vinyl-fs glob strings](https://github.com/gulpjs/vinyl-fs#srcglobs-options).

*Globs are executed in order, so negations should follow positive globs.*

Returns array of resolved paths.

### `Entry.multi(scope, files)`
- `scope: string` - Base directory.
- `files: Array` - List of files or promises like `Entry.src`.

Generates multi-page entries from the base directory. All the files that don't belong to the base directory will be added at the beginning of every entry.

#### Example

Let's say we have the following file structure:
```
- src/
    common.js
  - pages/
    - page1/
       index.js
       component.js
    - page2/
       index.js
```

And the following piece of code in `webpack.config.js`:
```javascript
pages: Entry.multi('src/pages', [
  'src/common.js',
  Entry.src([
    'src/pages/**/*.js',
  ]),
]),
```

That will generate us two entry points:
```json
{
  "page1": [
    "src/common.js",
    "src/page1/index.js",
    "src/page1/component.js"
  ],
  "page2": [
    "src/common.js",
    "src/page2/index.js"
  ]
}
```

## Links
- [webpack entry points](https://webpack.js.org/concepts/entry-points/)
- [gulpjs/vinyl-fs](https://github.com/gulpjs/vinyl-fs)
