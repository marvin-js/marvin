import test from 'ava';
import fs from 'fs';

import { writeFile } from '../utils-test/file';
import move from './move';

const TEMP_COMMAND_FOLDER = './temp/command-move'
const TEMP_COMMAND_MOVE_ORIGIN = `${TEMP_COMMAND_FOLDER}/test5`;
const TEMP_COMMAND_MOVE_DESTIN = `${TEMP_COMMAND_FOLDER}/test4`;

test.before('move', () => {
  return new Promise(resolve => {
    writeFile(TEMP_COMMAND_MOVE_ORIGIN, `hello world`, resolve);
  });
});

test('move', t => {
  return new Promise(resolve => {
    move({}, TEMP_COMMAND_MOVE_ORIGIN, TEMP_COMMAND_MOVE_DESTIN);

    setTimeout(() => {
      t.false(fs.existsSync(TEMP_COMMAND_MOVE_ORIGIN));
      t.true(fs.existsSync(TEMP_COMMAND_MOVE_DESTIN));
      resolve();
    }, 100);
  });
});

test.after('move', () => {
  fs.unlink(TEMP_COMMAND_MOVE_DESTIN);
});