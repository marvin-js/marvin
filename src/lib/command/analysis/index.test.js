import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';

import { writeFile } from '../../../utils-test/file';
import { processCommand, processCommandFile } from './index';

test('command empty should return undefined', t => {
  t.is(processCommand(), undefined);
  t.is(processCommand(undefined), undefined);
});

test('command get config', t => {

  const commandTest = 'cp /test2 /test3';

  const resultObject = {
    command: 'cp',
    args: ['/test2', '/test3'],
    options: {},
    commands: [],
    line: 1,
    nextLine: 2,
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config 2', t => {

  const commandTest = 'cp teste:"hello" hellow:test teste:123 otherParams:"hello world" url:"http://github.com" url2:\'http://npm.com\' #dev @channel';

  const resultObject = {
    command: 'cp',
    args: ['teste:"hello"', 'hellow:test', 'teste:123', 'otherParams:"hello world"', 'url:"http://github.com"', 'url2:\'http://npm.com\'', '#dev', '@channel'],
    options: {},
    commands: [],
    line: 1,
    nextLine: 2,
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with text', t => {

  const commandTest = 'cp /test2 "teste"';

  const resultObject = {
    command: 'cp',
    args: ['/test2', 'teste'],
    options: {},
    commands: [],
    line: 1,
    nextLine: 2,
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with text 2', t => {

  const commandTest = 'cp /test2 \'http://teste.com.br/2\' ';

  const resultObject = {
    command: 'cp',
    args: ['/test2', 'http://teste.com.br/2'],
    options: {},
    commands: [],
    line: 1,
    nextLine: 2,
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with text in subcommand', t => {

  const commandTest = `cp /test2 "http://teste.com.br/2" {
    touch "http://otherlink.com/"  
  }`;

  const resultObject = {
    command: 'cp',
    args: ['/test2', 'http://teste.com.br/2'],
    options: {},
    line: 1,
    nextLine: 4,
    commands: [{
      command: 'touch',
      args: ['http://otherlink.com/'],
      options: {},
      commands: [],
      line: 2,
      nextLine: 3,
      setVariables: undefined,
    }],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with boolean', t => {

  const commandTest = 'cp true false true';

  const resultObject = {
    command: 'cp',
    args: [true, false, true],
    options: {},
    commands: [],
    line: 1,
    nextLine: 2,
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with boolean in subcommand', t => {

  const commandTest = `cp true false true true {
    touch false false true true
  }`;

  const resultObject = {
    command: 'cp',
    args: [true, false, true, true],
    options: {},
    line: 1,
    nextLine: 4,
    commands: [{
      command: 'touch',
      args: [false, false, true, true],
      options: {},
      commands: [],
      line: 2,
      nextLine: 3,
      setVariables: undefined,
    }],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with number', t => {

  const commandTest = 'cp 1 2 3 4 123 123';

  const resultObject = {
    command: 'cp',
    args: [1, 2, 3, 4, 123, 123],
    options: {},
    commands: [],
    line: 1,
    nextLine: 2,
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with number in subcommand', t => {

  const commandTest = `cp 1 2 3 4 {
    touch 5 6 7 8
  }`;

  const resultObject = {
    command: 'cp',
    args: [1, 2, 3, 4],
    options: {},
    line: 1,
    nextLine: 4,
    commands: [{
      command: 'touch',
      args: [5, 6, 7, 8],
      options: {},
      commands: [],
      line: 2,
      nextLine: 3,
      setVariables: undefined,
    }],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config without args', t => {

  const commandTest = 'cp';

  const resultObject = {
    command: 'cp',
    args: [],
    options: {},
    line: 1,
    nextLine: 2,
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with options', t => {

  const commandTest = 'cp /test2 /test3 --someParams';

  const resultObject = {
    command: 'cp',
    line: 1,
    nextLine: 2,
    args: ['/test2', '/test3'],
    options: {
      someParams: true
    },
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with options-value', t => {

  const commandTest = 'cp /test2 /test3 --someParams=123';

  const resultObject = {
    command: 'cp',
    line: 1,
    nextLine: 2,
    args: ['/test2', '/test3'],
    options: {
      someParams: 123
    },
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

test('command get config with options-value and options', t => {

  const commandTest = 'cp /test2 /test3 --someParams=123 --test';

  const resultObject = {
    command: 'cp',
    line: 1,
    nextLine: 2,
    args: ['/test2', '/test3'],
    options: {
      someParams: 123,
      test: true,
    },
    commands: [],
    setVariables: undefined,
  };

  t.deepEqual(processCommand({command: commandTest}), resultObject);
});

const TEST_FILE_COMMAND = './temp/file-command/.workflow';

test.before('process file command', () => writeFile(TEST_FILE_COMMAND, `cp /test3 /test4\ncp /test4 /test5\nmv /test7 /test8 --force`));

test('process file command', t => {
  return processCommandFile(TEST_FILE_COMMAND).then(actions => {
    const resultObject = [
      {
        command: 'cp',
        args: ['/test3', '/test4'],
        options: {},
        line: 1,
        nextLine: 2,
        commands: [],
        setVariables: undefined,
      },
      {
        command: 'cp',
        args: ['/test4', '/test5'],
        options: {},
        line: 2,
        nextLine: 3,
        commands: [],
        setVariables: undefined,
      },
      {
        command: 'mv',
        args: ['/test7', '/test8'],
        line: 3,
        nextLine: 4,
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

const TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND= './temp/file-process-command-with-set-variables-and-sub-command/.workflow';

test.before('process file command with set variables and sub command', () => 
  writeFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND, `

    $result = rm /test3 {
      mkdir /test5
    }

    $result_2 = rm_2 /test3 {
      mkdir /test5
    }

    $result_3 = rm_3 /test3 {
      mkdir /test5
    }

    $result_4 = rm_4 /test3 {
      $result_3 = rm /test3 {
        mkdir /test5
      }
    }

    $result_5 = rm_5 /test3 {
      $result_3 = rm-esp /test3 {
        mkdir-ops /test_special --async --force=test
      }
    }
  `));

test('process file command with set variables and sub command', t => {
  return processCommandFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES_AND_SUB_COMMAND).then(actions => {


    const resultObject = [
      {
        command: 'rm',
        args: ['/test3'],
        options: {
          __hasReturn: true,
        },
        line: 3,
        nextLine: 6,
        setVariables: ['$result'],
        commands: [{
          command: 'mkdir',
          args: ['/test5'],
          options: {},
          line: 4,
          nextLine: 5,
          setVariables: undefined,
          commands: [],
        }],
      },
      {
        command: 'rm_2',
        args: ['/test3'],
        options: {
          __hasReturn: true,
        },
        line: 7,
        nextLine: 10,
        setVariables: ['$result_2'],
        commands: [{
          command: 'mkdir',
          args: ['/test5'],
          options: {},
          line: 8,
          nextLine: 9,
          setVariables: undefined,
          commands: [],
        }],
      },
      {
        command: 'rm_3',
        args: ['/test3'],
        options: {
          __hasReturn: true,
        },
        line: 11,
        nextLine: 14,
        setVariables: ['$result_3'],
        commands: [{
          command: 'mkdir',
          args: ['/test5'],
          line: 12,
          nextLine: 13,
          options: {},
          setVariables: undefined,
          commands: [],
        }],
      },
      {
        command: 'rm_4',
        args: ['/test3'],
        options: {
          __hasReturn: true,
        },
        line: 15,
        nextLine: 20,
        setVariables: ['$result_4'],
        commands: [{
          command: 'rm',
          args: ['/test3'],
          line: 16,
          nextLine: 19,
          options: {
            __hasReturn: true,
          },
          setVariables: ['$result_3'],
          commands: [{
            command: 'mkdir',
            args: ['/test5'],
            options: {},
            line: 17,
            nextLine: 18,
            setVariables: undefined,
            commands: [],
          }],
        }],
      },
      {
        command: 'rm_5',
        args: ['/test3'],
        line: 21,
        nextLine: 26,
        options: {
          __hasReturn: true,
        },
        setVariables: ['$result_5'],
        commands: [{
          command: 'rm-esp',
          args: ['/test3'],
          options: {
            __hasReturn: true,
          },
          line: 22,
          nextLine: 25,
          setVariables: ['$result_3'],
          commands: [{
            command: 'mkdir-ops',
            args: ['/test_special'],
            line: 23,
            nextLine: 24,
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

const TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES= './temp/file-process-command-with-set-variables/.workflow';

test.before('process file command with set variables', () => 
  writeFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES, `
    $result = cp /test3 /test4
  `));

test('process file command with set variables', t => {
  return processCommandFile(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES).then(actions => {
    const resultObject = [
      {
        command: 'cp',
        args: ['/test3', '/test4'],
        options: {
          __hasReturn: true,
        },
        setVariables: ['$result'],
        line: 2,
        nextLine: 3,
        commands: [],
      },
    ];

    t.deepEqual(actions, resultObject);
  });
});

test.after('process file command with set variables', () => {
  fs.unlink(TEST_PROCESS_FILE_COMMAND_WITH_SET_VARIABLES);
});
