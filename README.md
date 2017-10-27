# Webpack Vinyl Entry

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
  }),

  // ...
};
```

This statement generates function wrapper over Promise that returns webpack compatible entry points. You can use whatever is accepted by webpack in the object values and besides that you can easly generate an entry from [gulpjs/vinyl-fs](https://github.com/gulpjs/vinyl-fs) globs by using `Entry.src`.

## API

### `Entry(entries)`
- `entries: Object` - Object of webpack compatible [entry points](https://webpack.js.org/concepts/entry-points/) or Promises.

Returns function wrapping Promise that resolves all the Promises in `entries`.

### `Entry.src(globs)`
- `globs: Array` - Array of [vinyl-fs glob strings](https://github.com/gulpjs/vinyl-fs#srcglobs-options).

*Globs are executed in order, so negations should follow positive globs.*

Returns array of resolved paths.

## Links
- [webpack entry points](https://webpack.js.org/concepts/entry-points/)
- [gulpjs/vinyl-fs](https://github.com/gulpjs/vinyl-fs)
