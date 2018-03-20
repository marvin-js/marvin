import test from 'ava';

import { mountNamePlugin } from './plugin';

test('mountNamePlugin', t => {
  t.is(mountNamePlugin('cowsay'), 'marvin-plugin-cowsay');
});