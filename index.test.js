const Entry = require('./index'),
  path = require('path');

it('resolves promises', () => {
  expect.assertions(1);

  return expect(new Entry({
    a: 'file1',
    b: new Promise(resolve => {
      setTimeout(resolve.bind(null, 'file2'), 100);
    }),
  })()).resolves.toEqual({
    a: 'file1',
    b: 'file2',
  });
});

it('resolves globs', () => {
  expect.assertions(1);

  return expect(Entry.src([
    'index*.js',
    '!index.test.js',
  ])).resolves.toEqual([
    path.resolve(__dirname, 'index.js'),
  ]);
});
