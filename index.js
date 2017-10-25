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
