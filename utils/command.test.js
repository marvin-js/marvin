import test from 'ava';

import command from './command';

test('command empty should return undefined', t => {
  t.is(command(), undefined);
  t.is(command(undefined), undefined);
  t.is(command(null), undefined);
  t.is(command(''), undefined);
});

test('command get config', t => {

  const commandTest = 'cp /test2 /test3';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {},
  };

  t.deepEqual(command(commandTest), resultObject);
});

test('command get config without args', t => {

  const commandTest = 'cp';

  const resultObject = {
    command: 'cp',
    args: [],
    options: {},
  };

  t.deepEqual(command(commandTest), resultObject);
});

test('command get config with options', t => {

  const commandTest = 'cp /test2 /test3 --someParams';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {
      someParams: true
    },
  };

  t.deepEqual(command(commandTest), resultObject);
});

test('command get config with options-value', t => {

  const commandTest = 'cp /test2 /test3 --someParams=123';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {
      someParams: '123'
    },
  };

  t.deepEqual(command(commandTest), resultObject);
});