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

it('resolves multiple', () => {
  expect.assertions(1);

  return expect(new Entry({
    pages: Entry.multi('src/pages', [
      'src/pages/page1/index.js',
      'src/pages/page1/component.js',
      'src/pages/page2/index.js',
      Entry.src([
        'index*.js',
        '!index.test.js',
      ]),
    ]),
  })()).resolves.toEqual({
    page1: [
      path.resolve('index.js'),
      path.resolve('src/pages/page1/index.js'),
      path.resolve('src/pages/page1/component.js'),
    ],
    page2: [
      path.resolve('index.js'),
      path.resolve('src/pages/page2/index.js'),
    ],
  });
});
