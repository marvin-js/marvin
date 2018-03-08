import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

const FILE_DEFAULT = '.marvin';

const resolvePath = (file, opts = {}) => {

  const nameFile = file.indexOf('.marvin') > -1 ? file : `${file}.marvin`;
  const newPath = path.resolve(process.cwd(), opts.dir ? opts.dir : '', nameFile);
  const exist = fs.existsSync(newPath);

  if (opts.exitOnError && !exist) {
    console.log(`\n${chalk.red('✖')} File '${nameFile}' doesn't exist`);
    process.exit(1);
  }

  return newPath;
}

export const findFileWorkflow = (args = [], opts = {}) => {

  if (args.length === 0) return resolvePath(FILE_DEFAULT, opts);
  if (args.length === 1) return resolvePath(args[0] || FILE_DEFAULT, opts);

  return args.map(arg => {
    return resolvePath(arg || FILE_DEFAULT, opts);
  });
};