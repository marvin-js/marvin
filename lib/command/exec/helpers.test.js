import test from 'ava';
import sinon from 'sinon';
import { repeat } from './helpers';

test('repeat', t => {

  const execute = sinon.spy();
  const items = ['item1', 'item2'];
  const f = repeat(items);
  
  t.true(typeof f === 'function');

  const promise = f(execute);

  t.true(!!promise.then);

  return promise.then(() => {
    t.is(execute.callCount, 2);
    t.true(execute.firstCall.calledWith('item1'));
    t.true(execute.secondCall.calledWith('item2'));
  });
});

test('repeat with callback', t => {

  const object = {
    callback: (item) => `hello world ${item}`,
  };

  const execute = sinon.spy();
  const callback = sinon.spy(object, 'callback');
  const items = ['item1', 'item2'];
  const f = repeat(items, callback);
  
  t.true(typeof f === 'function');

  const promise = f(execute);

  t.true(!!promise.then);

  return promise.then(() => {
    t.is(execute.callCount, 2);
    t.is(callback.callCount, 2);
    t.true(callback.firstCall.calledWith('item1', 0));
    t.true(callback.secondCall.calledWith('item2', 1));
    t.true(execute.firstCall.calledWith('hello world item1'));
    t.true(execute.secondCall.calledWith('hello world item2'));
  });
});

test('repeat without items', t => {

  const execute = sinon.spy();
  const f = repeat();
  
  t.true(typeof f === 'function');

  const promise = f(execute);

  t.true(!!promise.then);

  return promise.then(() => {
    t.false(execute.calledOnce);
  });
});