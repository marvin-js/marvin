import test from 'ava';
import fs from 'fs';

import { readFile } from '../utils-test/file';
import create from './create';

const TEST_FILE_CREATE = './temp/command-create/teste.txt';

test('command create', t => {
  return create({}, TEST_FILE_CREATE, 'asdasd asdasd asdasdasd asd asd asdasdasd asdasas').then(path => {

    t.is(path, TEST_FILE_CREATE);

    return readFile(TEST_FILE_CREATE).then(content => {
      t.is(content, 'asdasd asdasd asdasdasd asd asd asdasdasd asdasas');
    });
  });
});

test.after('command create', () => {
  fs.unlink(TEST_FILE_CREATE);
});

const TEST_FILE_CREATE_MULTIPLE_CONTENT = './temp/command-create-multiple-content/teste.txt';

test('command create multiple content', t => {
  return create({}, TEST_FILE_CREATE_MULTIPLE_CONTENT, 'hello', 'world').then(path => {

    t.is(path, TEST_FILE_CREATE_MULTIPLE_CONTENT);

    return readFile(TEST_FILE_CREATE_MULTIPLE_CONTENT).then(content => {
      t.is(content, 'helloworld');
    });
  });
});

test.after('command create multiple content', () => {
  fs.unlink(TEST_FILE_CREATE_MULTIPLE_CONTENT);
});

const TEST_FILE_CREATE_DIR = './temp/command-create-dir';

test('command create only dir', t => {
  return create({dir: true}, TEST_FILE_CREATE_DIR).then(path => {
    t.is(path, TEST_FILE_CREATE_DIR);
    t.true(fs.existsSync(path));
  });
});

test.after('command create only dir', () => {
  fs.rmdirSync(TEST_FILE_CREATE_DIR);
});
