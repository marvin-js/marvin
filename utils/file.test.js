import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';

import { writeFile } from '../utils-test/file';
import { processFile } from './file';

const TEMP_FILE_LINE_BY_LINE = './temp/line-by-line/.workflow';

test.before('read line-by-line', () => {
  return new Promise(resolve => {
    writeFile(TEMP_FILE_LINE_BY_LINE, `cp /test3 /teste4\ncp /test4 /teste5`, resolve);
  });
});

test('read line-by-line', t => {
  return new Promise((resolve, reject) => {

    const eachLineSpy = sinon.spy();

    processFile(TEMP_FILE_LINE_BY_LINE, {
      eachLine: eachLineSpy,
    });

    setTimeout(() => {
      t.is(eachLineSpy.callCount, 2);
      t.true(eachLineSpy.firstCall.calledWith('cp /test3 /teste4'));
      t.true(eachLineSpy.secondCall.calledWith('cp /test4 /teste5'));
      resolve();
    }, 500);
  });
});

test.after('read line-by-line', () => {
  fs.unlink(TEMP_FILE_LINE_BY_LINE);
});