import test from 'ava';

import { readAsLabel } from './parameters';

test('readAsLabel', t => {

  const result = {
    teste: 'hello world',
    ops: true,
    number: 123,
    link: 'http://github.com',
  };

  t.deepEqual(readAsLabel(['teste:"hello world"', 'ops:true', 'number:123', 'link:"http://github.com"']), result);
});