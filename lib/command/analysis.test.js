import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';

import { writeFile } from '../../utils-test/file';
import { processCommand, processCommandFile } from './analysis';

test('command empty should return undefined', t => {
  t.is(processCommand(), undefined);
  t.is(processCommand(undefined), undefined);
  t.is(processCommand(null), undefined);
  t.is(processCommand(''), undefined);
});

test('command get config', t => {

  const commandTest = 'cp /test2 /test3';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {},
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand(commandTest), resultObject);
});

test('command get config without args', t => {

  const commandTest = 'cp';

  const resultObject = {
    command: 'cp',
    args: [],
    options: {},
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand(commandTest), resultObject);
});

test('command get config with options', t => {

  const commandTest = 'cp /test2 /test3 --someParams';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {
      someParams: true
    },
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand(commandTest), resultObject);
});

test('command get config with options-value', t => {

  const commandTest = 'cp /test2 /test3 --someParams=123';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {
      someParams: '123'
    },
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand(commandTest), resultObject);
});

test('command get config with options-value and options', t => {

  const commandTest = 'cp /test2 /test3 --someParams=123 --test';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {
      someParams: '123',
      test: true,
    },
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand(commandTest), resultObject);
});

const TEST_FILE_COMMAND = './temp/file-command/.workflow';

test.before('process file command', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND, `cp /test3 /test4\ncp /test4 /test5\nmv /test7 /test8 --force`, resolve);
  });
});

test('process file command', t => {
  return processCommandFile(TEST_FILE_COMMAND).then(actions => {
    const resultObject = [
      {
        command: 'cp',
        args: ['/test3', '/test4'],
        options: {},
        commands: [],
        setVariables: undefined,
      },
      {
        command: 'cp',
        args: ['/test4', '/test5'],
        options: {},
        commands: [],
        setVariables: undefined,
      },
      {
        command: 'mv',
        args: ['/test7', '/test8'],
        options: {
          force: true,
        },
        commands: [],
        setVariables: undefined,
      },
    ];

    t.deepEqual(actions, resultObject);
  });
});

test.after('process file command', () => {
  fs.unlink(TEST_FILE_COMMAND);
});