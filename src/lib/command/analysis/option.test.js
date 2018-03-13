import test from 'ava';
import sinon from 'sinon';

import { isOption, setOption } from './option';

test('isOption', t => {
  t.true(isOption('--teste=ops'));
  t.false(isOption('asdasdasd=asdasd'));
  t.false(isOption('asdasd--asdasdasd=asdasdasd'));
});

test('setOption', t => {
  const callback = sinon.spy();

  setOption('--teste=hello', callback);

  t.true(callback.calledOnce);
  t.true(callback.calledWith('teste', 'hello'));
});

test('setOption without value', t => {
  const callback = sinon.spy();

  setOption('--teste', callback);

  t.true(callback.calledOnce);
  t.true(callback.calledWith('teste', true));
});