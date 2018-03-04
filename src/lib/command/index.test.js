import test from 'ava';
import fs from 'fs';
import sinon from 'sinon';

import { writeFile } from '../../utils-test/file';
import { runFile } from './index';

const TEST_RUN_FILE_COMMAND = './temp/file-run-command/.workflow';

test.before('run file command', () =>
    writeFile(TEST_RUN_FILE_COMMAND, `cp /test3 /test4\ncp /test4 /test5\nmv /test7 /test8 --force`));

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