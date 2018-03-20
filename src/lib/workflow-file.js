import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

import { MARVIN_EXTENSION } from '../const';

const resolvePath = (file, opts = {}) => {

  const nameFile = file.indexOf(MARVIN_EXTENSION) > -1 ? file : `${file}${MARVIN_EXTENSION}`;
  const newPath = path.resolve(process.cwd(), opts.dir ? opts.dir : '', nameFile);
  const exist = fs.existsSync(newPath);

  if (opts.exitOnError && !exist) {
    console.log(`\n${chalk.red('✖')} File '${nameFile}' doesn't exist`);
    process.exit(1);
  }

  return newPath;
};

export const findFileWorkflow = (args = [], opts = {}) => {

  if (args.length === 0) return resolvePath(MARVIN_EXTENSION, opts);
  if (args.length === 1) return resolvePath(args[0] || MARVIN_EXTENSION, opts);

  return args.map(arg => {
    return resolvePath(arg || MARVIN_EXTENSION, opts);
  });
};