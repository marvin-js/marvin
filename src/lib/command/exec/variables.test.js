import test from 'ava';
import { setResultVariables, getResultVariables } from './variables';

test('setResultVariables', t => {

  const store = {};
  const confStore = {
    setStore: (name, value) => store[name] = value,
    getStore: (name) => store[name],
  };
  const actions = {
    setVariables: ['$test'],
  };

  setResultVariables('hello world', actions, confStore);
  
  t.is(confStore.getStore('$test'), 'hello world');
});

test('setResultVariables with undefined', t => {

  const store = {
    $test: 'hello world',
  };
  const confStore = {
    setStore: (name, value) => store[name] = value,
    getStore: (name) => store[name],
  };
  const actions = {
    setVariables: ['$test'],
  };

  setResultVariables(undefined, actions, confStore);
  
  t.is(confStore.getStore('$test'), undefined);
});

test('getResultVariables', t => {

  const store = {
    $test: 'hello world',
    $test2: 'foo bar',
  };
  const confStore = {
    setStore: (name, value) => store[name] = value,
    getStore: (name) => store[name],
  };
  const actions = {
    options: {
      enable: '$test',
    },
    args: ['$test2']
  };

  const result = getResultVariables(actions.options, actions.args, confStore);
  
  t.is(result.args[0], 'foo bar');
  t.is(result.options.enable, 'hello world');
});

test('getResultVariables with args undefined', t => {

  const store = {
    $test: 'hello world',
    $test2: 'foo bar',
  };
  const confStore = {
    setStore: (name, value) => store[name] = value,
    getStore: (name) => store[name],
  };
  const actions = {
    options: {
      enable: '$test',
    },
  };

  const result = getResultVariables(actions.options, actions.args, confStore);
  
  t.deepEqual(result.args, []);
  t.is(result.options.enable, 'hello world');
});

test('getResultVariables with options undefined', t => {

  const store = {
    $test: 'hello world',
    $test2: 'foo bar',
  };
  const confStore = {
    setStore: (name, value) => store[name] = value,
    getStore: (name) => store[name],
  };
  const actions = {
    args: ['$test2']
  };

  const result = getResultVariables(actions.options, actions.args, confStore);
  
  t.is(result.args[0], 'foo bar');
  t.deepEqual(result.options, {});
});

