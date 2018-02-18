import test from 'ava';
import fs from 'fs';

import { writeFile } from '../utils-test/file';
import append from './append';

const TEST_FILE_APPEND = './temp/command-append/teste.txt';

test.before('command append', () => writeFile(TEST_FILE_APPEND, `teste \nteste2 \n`));

test('command append', t => {
  return append({__hasReturn: true}, TEST_FILE_APPEND, 'hello world').then((content) => {
    t.is(content, 'teste \nteste2 \nhello world');
  });
});

test.after('command append', () => {
  fs.unlink(TEST_FILE_APPEND);
});

const TEST_FILE_APPEND_2 = './temp/command-append-2/teste.txt';

test.before('command append 2', () => writeFile(TEST_FILE_APPEND_2, `testeteste2`));

test('command append 2', t => {
  return append({__hasReturn: true}, TEST_FILE_APPEND_2, 'hello world').then((content) => {
    t.is(content, 'testeteste2hello world');
  });
});

test.after('command append 2', () => {
  fs.unlink(TEST_FILE_APPEND_2);
});

const TEST_FILE_APPEND_WITHOUT_VARIABLES = './temp/command-append-without-variables/teste.txt';

test.before('command append without variables', () => writeFile(TEST_FILE_APPEND_WITHOUT_VARIABLES, `teste \nteste2 \n`));

test('command append without variables', t => {
  return append({}, TEST_FILE_APPEND_WITHOUT_VARIABLES, 'hello world').then((content) => {
    t.is(content, undefined);
  });
});

test.after('command append without variables', () => {
  fs.unlink(TEST_FILE_APPEND_WITHOUT_VARIABLES);
});

