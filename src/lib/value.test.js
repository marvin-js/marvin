import test from 'ava';

import { transformValue } from './value';

test('isBoolean', t => {
  t.true(transformValue(true));
  t.false(transformValue(false));
  t.true(transformValue('true'));
  t.false(transformValue('false'));
});

test('isNumber', t => {
  t.is(transformValue('123'), 123);
  t.is(transformValue(123), 123);
});

test('isText', t => {
  t.is(transformValue('123test'), '123test');
  t.is(transformValue('"hello world"'), 'hello world');
  t.is(transformValue('truehello'), 'truehello');
});