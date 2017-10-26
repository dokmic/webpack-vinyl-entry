const Stream = require('stream'),
  vfs = require('vinyl-fs'),
  transform = require('vinyl-transform');

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
        entries[key] = values[index];

        return entries;
      },
      {}
    ));

  return Object.assign(globs, entries);
};

module.exports = Entry;
module.exports.src = src;
