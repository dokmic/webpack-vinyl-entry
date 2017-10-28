const Stream = require('stream'),
  path = require('path'),
  vfs = require('vinyl-fs'),
  transform = require('vinyl-transform');

/**
 * Generate multi-page entries
 *
 * @param {string} scope
 * @param {Array} files
 * @return {Promise}
 */
function multi(scope, files) {
  return Promise.all(files)
  .then(paths => paths.reduce(
    (files, file) => {
      if (Array.isArray(file)) {
        files.push(...file);
      } else {
        files.push(file);
      }

      return files;
    },
    []
  ))
  .then(files => files.reduce(
    (acc, file) => {
      const relative = path.relative(
        path.resolve(scope),
        path.resolve(file)
      );

      if (relative && '.' !== relative[0]) {
        acc.scoped.push(relative);
      } else {
        acc.shared.push(file);
      }

      return acc;
    },
    { shared: [], scoped: [] }
  ))
  .then(files => {
    const entries = {};
    Object.setPrototypeOf(entries, Entry);

    files.scoped.forEach(file => {
      const entry = file.split('/')[0];

      if (!entries[entry]) {
        entries[entry] = [].concat(files.shared);
      }
      entries[entry].push(path.resolve(scope, file));
    });

    return entries;
  });
}

/**
 * Get files from vinyl globs
 *
 * @param  {Array} globs
 * @return {Promise}
 */
function src(globs) {
  return new Promise(resolve => {
    let files = [];

    vfs.src(globs, {
      buffer: false,
    })
    .pipe(transform(file => {
      let stream = new Stream.PassThrough();

      files.push(file);
      stream.end(new Buffer(file));

      return stream;
    }))
    .on('end', resolve.bind(this, files));
  });
}

/**
 * Generate dynamic webpack entry
 *
 * @param {Object} entries
 * @return {Function}
 */
function Entry(entries) {
  let globs = () => Promise
    .all(Object.keys(globs).map(key => globs[key]))
    .then(values => Object.keys(globs).reduce(
      (entries, key, index) => {
        if (Entry === Object.getPrototypeOf(values[index])) {
          Object.assign(entries, values[index]);
        } else {
          entries[key] = values[index];
        }

        return entries;
      },
      {}
    ));

  return Object.assign(globs, entries);
};

module.exports = Entry;
module.exports.multi = multi;
module.exports.src = src;
