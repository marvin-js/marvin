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

    const execute = generateCommand(actions, libExternals);

    return execute().then(() => {
      t.true(cp.firstCall.calledWith({}, '/test3', '/test4'));
      t.true(cp.secondCall.calledWith({}, '/test4', '/test5'));
      t.true(mv.calledWith({force: true}, '/test7', '/test8'));
    });
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

const TEST_PROCESS_FILE_COMMAND_WITH_SUB_COMMAND = './temp/file-process-command-with-sub-command/.workflow';

test.before('process file command with sub command', () => {
  return new Promise(resolve => {
    writeFile(TEST_PROCESS_FILE_COMMAND_WITH_SUB_COMMAND, `
      cp /test3 /test4
      cp /test4 /test5
      mv /test7 /test8 --force
      watch /test10 {
        mkdir /test8
      }
    `, resolve);
  });
});

test('process file command with sub command', t => {
  return processCommandFile(TEST_PROCESS_FILE_COMMAND_WITH_SUB_COMMAND).then(actions => {
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
      {
        command: 'watch',
        args: ['/test10'],
        options: {},
        commands: [{
          command: 'mkdir',
          args: ['/test8'],
          options: {},
          commands: [],
          setVariables: undefined,
        }],
        setVariables: undefined,
      },
    ];

    t.deepEqual(actions, resultObject);
  });
});

test.after('process file command with sub command', () => {
  fs.unlink(TEST_PROCESS_FILE_COMMAND_WITH_SUB_COMMAND);
});

const TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES= './temp/file-process-command-with-set-variables/.workflow';

test.before('process file command with set variables', () => {
  return new Promise(resolve => {
    writeFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES, `
      $result = cp /test3 /test4
    `, resolve);
  });
});

test('process file command with set variables', t => {
  return processCommandFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES).then(actions => {
    const resultObject = [
      {
        command: 'cp',
        args: ['/test3', '/test4'],
        options: {},
        setVariables: ['$result'],
        commands: [],
      },
    ];

    t.deepEqual(actions, resultObject);
  });
});

test.after('process file command with set variables', () => {
  fs.unlink(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES);
});

const TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND= './temp/file-process-command-with-set-variables-and-sub-command/.workflow';

test.before('process file command with set variables and sub command', () => {
  return new Promise(resolve => {
    writeFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND, `
      $result = rm /test3 {
        mkdir /test5
      }

      $result = rm /test3 {
        mkdir /test5
      }

      $result_2 = rm /test3 {
        mkdir /test5
      }

      $result_2 = rm /test3 {
        $result_3 = rm /test3 {
          mkdir /test5
        }
      }

      $result_2 = rm /test3 {
        $result_3 = rm-esp /test3 {
          mkdir-ops /test_special --async --force=test
        }
      }
    `, resolve);
  });
});

test('process file command with set variables and sub command', t => {
  return processCommandFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND).then(actions => {

    const resultObject = [
      {
        command: 'rm',
        args: ['/test3'],
        options: {},
        setVariables: ['$result'],
        commands: [{
          command: 'mkdir',
          args: ['/test5'],
          options: {},
          setVariables: undefined,
          commands: [],
        }],
      },
      {
        command: 'rm',
        args: ['/test3'],
        options: {},
        setVariables: ['$result'],
        commands: [{
          command: 'mkdir',
          args: ['/test5'],
          options: {},
          setVariables: undefined,
          commands: [],
        }],
      },
      {
        command: 'rm',
        args: ['/test3'],
        options: {},
        setVariables: ['$result_2'],
        commands: [{
          command: 'mkdir',
          args: ['/test5'],
          options: {},
          setVariables: undefined,
          commands: [],
        }],
      },
      {
        command: 'rm',
        args: ['/test3'],
        options: {},
        setVariables: ['$result_2'],
        commands: [{
          command: 'rm',
          args: ['/test3'],
          options: {},
          setVariables: ['$result_3'],
          commands: [{
            command: 'mkdir',
            args: ['/test5'],
            options: {},
            setVariables: undefined,
            commands: [],
          }],
        }],
      },
      {
        command: 'rm',
        args: ['/test3'],
        options: {},
        setVariables: ['$result_2'],
        commands: [{
          command: 'rm-esp',
          args: ['/test3'],
          options: {},
          setVariables: ['$result_3'],
          commands: [{
            command: 'mkdir-ops',
            args: ['/test_special'],
            options: {
              async: true,
              force: 'test',
            },
            setVariables: undefined,
            commands: [],
          }],
        }],
      },
    ];

    t.deepEqual(actions, resultObject);
  });
});

test.after('process file command with set variables and sub command', () => {
  fs.unlink(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND);
});


