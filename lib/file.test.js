import test from 'ava';
import fs from 'fs';

import { writeFile } from '../utils-test/file';
import { readFile } from './file';

const TEMP_FILE_LINE_BY_LINE = './temp/line-by-line/.workflow';

test.before('read line-by-line', () =>
  writeFile(TEMP_FILE_LINE_BY_LINE, `cp /test3 /teste4\ncp /test4 /teste5`));

test('read line-by-line', t => {
  return new Promise((resolve, reject) => {
    readFile(TEMP_FILE_LINE_BY_LINE)
      .then(content => {
        t.is(content, `cp /test3 /teste4\ncp /test4 /teste5`);
        resolve();
      });
  });
});

test.after('read line-by-line', () => {
  fs.unlink(TEMP_FILE_LINE_BY_LINE);
});