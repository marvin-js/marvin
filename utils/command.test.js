import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';

import { writeFile } from '../utils-test/file';

import { processCommand, processCommandFile, generateCommand, runFile } from './command';

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
  };

  t.deepEqual(processCommand(commandTest), resultObject);
});

test('command get config without args', t => {

  const commandTest = 'cp';

  const resultObject = {
    command: 'cp',
    args: [],
    options: {},
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
      },
      {
        command: 'cp',
        args: ['/test4', '/test5'],
        options: {},
      },
      {
        command: 'mv',
        args: ['/test7', '/test8'],
        options: {
          force: true,
        },
      },
    ];

    t.deepEqual(actions, resultObject);
  });
});

test.after('process file command', () => {
  fs.unlink(TEST_FILE_COMMAND);
});

const TEST_FILE_COMMAND_GENERATED = './temp/file-command-generated/.workflow';

test.before('process file command generated', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND_GENERATED, `cp /test3 /test4\ncp /test4 /test5\nmv /test7 /test8 --force`, resolve);
  });
});

test('process file command generated', t => {
  return processCommandFile(TEST_FILE_COMMAND).then(actions => {

    const cp = sinon.spy();
    const mv = sinon.spy();

    const libExternals = {
      cp,
      mv,
    };

    const actionsGenerated = generateCommand(actions, libExternals);

    actionsGenerated.forEach(action => action());

    t.true(cp.firstCall.calledWith({}, '/test3', '/test4'));
    t.true(cp.secondCall.calledWith({}, '/test4', '/test5'));
    t.true(mv.calledWith({force: true}, '/test7', '/test8'));
  });
});

test.after('process file command generated', () => {
  fs.unlink(TEST_FILE_COMMAND_GENERATED);
});

const TEST_RUN_FILE_COMMAND = './temp/file-run-command/.workflow';

test.before('run file command', () => {
  return new Promise(resolve => {
    writeFile(TEST_RUN_FILE_COMMAND, `cp /test3 /test4\ncp /test4 /test5\nmv /test7 /test8 --force`, resolve);
  });
});

test('run file command', t => {
  const cp = sinon.spy();
  const mv = sinon.spy();

  const libExternals = {
    cp,
    mv,
  };

  return runFile(TEST_RUN_FILE_COMMAND, libExternals).then(() => {
    t.true(cp.firstCall.calledWith({}, '/test3', '/test4'));
    t.true(cp.secondCall.calledWith({}, '/test4', '/test5'));
    t.true(mv.calledWith({force: true}, '/test7', '/test8'));
  });
});

test.after('run file command', () => {
  fs.unlink(TEST_RUN_FILE_COMMAND);
});


