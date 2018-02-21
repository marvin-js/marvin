import test from 'ava';
import fs from 'fs';

import { writeFile, readFile } from '../utils-test/file';
import copy from './copy';

const TEST_FILE_ORIGIN = './temp/command-copy/teste.txt';
const TEST_FILE_DEST = './temp/command-copy/teste.copy.txt';

test.before('command append', () => writeFile(TEST_FILE_ORIGIN, `teste \nteste2 \n`));

test('command append', t => {
  return copy({}, TEST_FILE_ORIGIN, TEST_FILE_DEST).then(() => {

    return readFile(TEST_FILE_DEST).then(content => {
      t.is(content, 'teste \nteste2 \n');
    });
  });
});

test.after('command append', () => {
  fs.unlink(TEST_FILE_ORIGIN);
  fs.unlink(TEST_FILE_DEST);
});
