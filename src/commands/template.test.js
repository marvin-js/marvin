import test from 'ava';
import fs from 'fs';

import { writeFile } from '../utils-test/file';
import template from './template';

const TEMP_COMMAND_TEMPLATE = './temp/template.txt';

test.before('template', () => writeFile(TEMP_COMMAND_TEMPLATE, `hello <%= name %>`));

test('template', t => {
  return template({file: TEMP_COMMAND_TEMPLATE}, ['name:"marvin panic"'])
  .then(content => {
    t.is(content, 'hello marvin panic');
  });
});

test.after('template', () => {
  fs.unlink(TEMP_COMMAND_TEMPLATE);
});