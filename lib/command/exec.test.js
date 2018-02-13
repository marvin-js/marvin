import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';

import { writeFile } from '../../utils-test/file';

import { generateCommand, wrapperInstanceGenerator } from './exec';
import { processCommandFile } from './analysis';

const TEST_FILE_COMMAND_GENERATED = './temp/file-command-generated/.workflow';

test.before('process file command generated', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND_GENERATED, `cp /test3 /test4\ncp /test4 /test5\nmv /test7 /test8 --force`, resolve);
  });
});

test('process file command generated', t => {
  return processCommandFile(TEST_FILE_COMMAND_GENERATED).then(actions => {

    const cp = sinon.spy();
    const mv = sinon.spy();

    const libExternal = {
      cp,
      mv,
    };

    const execute = generateCommand(actions, {
      libExternal
    });

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


const TEST_FILE_COMMAND_GENERATED_RESULT = './temp/file-command-generated-result/.workflow';

test.before('process file command generated with result', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND_GENERATED_RESULT, `
      $result = cp /test3 /test4
      cp /test4 /test5
      mv /test7 /test8 --force
    `, resolve);
  });
});

test('process file command generated with result', t => {
  return processCommandFile(TEST_FILE_COMMAND_GENERATED_RESULT).then(actions => {

    let store = {};

    const object = { 
      method: () => 'teste',
      setStore: (name, value) => store[name] = value,
      getStore: (name) => store[name],
    };

    const cp = sinon.spy(object, 'method');
    const mv = sinon.spy();
    
    const setStore = sinon.spy(object, 'setStore');
    const getStore = sinon.spy(object, 'getStore');

    const libExternal = {
      cp,
      mv,
    };

    const execute = generateCommand(actions, {
      libExternal,
      store: {
       setStore,
       getStore, 
      },
    });

    return execute().then(() => {
      t.true(cp.firstCall.returned('teste'));
      t.true(setStore.calledWith('$result', 'teste'));
      t.is(store.$result, 'teste');
      t.true(cp.firstCall.calledWith({}, '/test3', '/test4'));
      t.true(cp.secondCall.calledWith({}, '/test4', '/test5'));
      t.true(mv.calledWith({force: true}, '/test7', '/test8'));
    });
  });
});

test.after('process file command generated with result', () => {
  fs.unlink(TEST_FILE_COMMAND_GENERATED_RESULT);
});

const TEST_FILE_COMMAND_GENERATED_RESULT_2 = './temp/file-command-generated-result-2/.workflow';

test.before('process file command generated with result 2', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND_GENERATED_RESULT_2, `
      $result = cp /test3 /test4
      cp /test4 /test5 --opt=$result
      mv /test7 $result --force
    `, resolve);
  });
});

test('process file command generated with result 2', t => {
  return processCommandFile(TEST_FILE_COMMAND_GENERATED_RESULT_2).then(actions => {

    let store = {};

    const object = { 
      method: (opts, orig, dest) => {
        return dest
      },
      setStore: (name, value) => store[name] = value,
      getStore: (name) => store[name],
    };

    const cp = sinon.spy(object, 'method');
    const mv = sinon.spy();
    
    const setStore = sinon.spy(object, 'setStore');
    const getStore = sinon.spy(object, 'getStore');

    const libExternal = {
      cp,
      mv,
    };

    const execute = generateCommand(actions, {
      libExternal,
      store: {
       setStore,
       getStore, 
      },
    });

    return execute().then(() => {
      t.true(cp.firstCall.returned('/test4'));
      t.true(cp.secondCall.returned('/test5'))
      t.true(cp.secondCall.calledWith({opt: '/test4'}, '/test4', '/test5'));
      t.true(mv.calledWith({force: true}, '/test7', '/test4'));
    });
  });
});

test.after('process file command generated with result 2', () => {
  fs.unlink(TEST_FILE_COMMAND_GENERATED_RESULT_2);
});

const TEST_FILE_COMMAND_GENERATED_RESULT_3 = './temp/file-command-generated-result-3/.workflow';

test.before('process file command generated with result 3', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND_GENERATED_RESULT_3, `
      $fetch = fetch {
        $otherFunction = otherFunction $fetch {
          otherFunctionSub $otherFunction
        }
      }
      $result = cp /test3 /test4
      cp /test4 /test5 --opt=$result
      mv /test7 $result --force
    `, resolve);
  });
});

test('process file command generated with result 3', t => {
  return processCommandFile(TEST_FILE_COMMAND_GENERATED_RESULT_3).then(actions => {

    let store = {};

    const object = { 
      method: (opts, orig, dest) => {
        return dest
      },
      setStore: (name, value) => store[name] = value,
      getStore: (name) => store[name],
      fetch: () => 'fetch_test',
      otherFunction: () => 'otherFunction_test',
    };

    const cp = sinon.spy(object, 'method');
    const mv = sinon.spy();
    const fetch = sinon.spy(object, 'fetch');
    const otherFunction = sinon.spy(object, 'otherFunction');
    const otherFunctionSub = sinon.spy();
    
    const setStore = sinon.spy(object, 'setStore');
    const getStore = sinon.spy(object, 'getStore');

    const libExternal = {
      cp,
      mv,
      fetch,
      otherFunction,
      otherFunctionSub,
    };

    const execute = generateCommand(actions, {
      libExternal,
      store: {
       setStore,
       getStore, 
      },
    });

    return execute().then(() => {
      t.true(cp.firstCall.returned('/test4'));
      t.true(cp.secondCall.returned('/test5'))
      t.true(cp.secondCall.calledWith({opt: '/test4'}, '/test4', '/test5'));
      t.true(mv.calledWith({force: true}, '/test7', '/test4'));
      t.true(fetch.returned('fetch_test'));
      t.true(otherFunction.calledWith({}, 'fetch_test'));
      t.true(otherFunctionSub.calledWith({}, 'otherFunction_test') )
    });
  });
});

test.after('process file command generated with result 3', () => {
  fs.unlink(TEST_FILE_COMMAND_GENERATED_RESULT_3);
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

const TEST_FILE_COMMAND_GENERATED_RESULT_WITH_ASYNC = './temp/file-command-generated-result-with-async/.workflow';

test.before('process file command generated with async', () => {
  return new Promise(resolve => {
    writeFile(TEST_FILE_COMMAND_GENERATED_RESULT_WITH_ASYNC, `
      $resultFetch = fetch http://teste.com.br --async {
        touch /test/result $resultFetch
        $resultFetch4 = fetch2 http://teste5.com.br --async {
          cp /teste $resultFetch4
        }
      }

      $resultFetch2 = fetch2 http://teste.com.br --async {
        cp /test/result $resultFetch2 $resultFetch
        $resultFetch3 = fetch http://teste2.com.br --async {
          touch /teste $resultFetch3
        }
      }
    `, resolve);
  });
});

test('process file command generated with async', t => {
  return processCommandFile(TEST_FILE_COMMAND_GENERATED_RESULT_WITH_ASYNC).then(actions => {

    let store = {};

    const object = { 
      setStore: (name, value) => store[name] = value,
      getStore: (name) => store[name],
      fetch: () => new Promise(resolve => {
        setTimeout(() => {
          resolve('fetch_test');
        }, 1000);
      }),
      fetch2: () => new Promise(resolve => {
        setTimeout(() => {
          resolve('fetch_test2');
        }, 500);
      }),
    };

    const fetch = sinon.spy(object, 'fetch');
    const fetch2 = sinon.spy(object, 'fetch2');
    const touch = sinon.spy();
    const cp = sinon.spy();
    
    const setStore = sinon.spy(object, 'setStore');
    const getStore = sinon.spy(object, 'getStore');

    const libExternal = {
      fetch,
      fetch2,
      touch,
      cp,
    };

    const execute = wrapperInstanceGenerator(generateCommand(actions, {
      libExternal,
      store: {
       setStore,
       getStore, 
      },
    }));

    return execute().then(() => {
      t.false(touch.threw());
      t.false(cp.threw());
      t.true(touch.firstCall.calledWith({}, '/test/result', 'fetch_test'));
      t.true(cp.firstCall.calledWith({}, '/test/result', 'fetch_test2', undefined));
    });
  });
});

test.after('process file command generated with async', () => {
  fs.unlink(TEST_FILE_COMMAND_GENERATED_RESULT_WITH_ASYNC);
});

