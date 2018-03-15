import isInstalledGlobally from 'is-installed-globally';
import findRoot from 'find-root';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const MARVINRC = '.marvin.yml';

if (isInstalledGlobally) {
  const PATH_GLOBALLY = path.resolve(process.env.HOME, MARVINRC);
  const exist = fs.existsSync(PATH_GLOBALLY);
  fs.writeFileSync(PATH_GLOBALLY, '', 'utf8');
  console.log(`\n${chalk.green('✔')} ${PATH_LOCAL}`);
} else {
  const PATH_LOCAL = path.resolve(findRoot(process.cwd()), MARVINRC);
  const exist = fs.existsSync(PATH_LOCAL);
  fs.writeFileSync(PATH_LOCAL, '', 'utf8');
  console.log(`\n${chalk.green('✔')} ${PATH_LOCAL}`);
}