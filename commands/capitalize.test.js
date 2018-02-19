import test from 'ava';

import capitalize from './capitalize';

test('capitalize', async t => {
  const result = await capitalize({}, 'hello world');
  t.is(result, 'Hello World');
});