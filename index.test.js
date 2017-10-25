const Entry = require('./index');

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
