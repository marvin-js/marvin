import test from 'ava';
import fs from 'fs';

import { writeFile } from '../utils-test/file';
import copy from './copy';

const TEMP_COMMAND_FOLDER = './temp/command-copy'
const TEMP_COMMAND_COPY_ORIGIN = `${TEMP_COMMAND_FOLDER}/test5`;
const TEMP_COMMAND_COPY_DESTIN = `${TEMP_COMMAND_FOLDER}/test4`;

test.before('copy', () => {
  return new Promise(resolve => {
    writeFile(TEMP_COMMAND_COPY_ORIGIN, `hello world`, resolve);
  });
});

test('copy', t => {
  return new Promise(resolve => {
    copy({}, TEMP_COMMAND_COPY_ORIGIN, TEMP_COMMAND_COPY_DESTIN);

    setTimeout(() => {
      t.true(fs.existsSync(TEMP_COMMAND_COPY_DESTIN));
      resolve();
    }, 100);
  });
});

test.after('copy', () => {
  fs.unlink(TEMP_COMMAND_COPY_ORIGIN);
  fs.unlink(TEMP_COMMAND_COPY_DESTIN);
});