import fs from 'fs-extra';
import template from 'lodash/template';
import { readFile } from '../lib/file';
import { readAsLabel } from '../lib/parameters';

export default function (opts, ...args) {
  return readFile(opts.file).then(content => {
    return template(content)(readAsLabel(args));
  });
}