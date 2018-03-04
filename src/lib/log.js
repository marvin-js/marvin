import Draftlog from 'draftlog';
import chalk from 'chalk';

Draftlog(console);

export const info = (...args) => `${chalk.bgBlue(' INFO ')}: ${args.join(' ')}`;

export const warn = (...args) => `${chalk.keyword('orange').inverse(' WARN ')}: ${args.join(' ')}`;

export const erro = (...args) => `${chalk.bgRed(' ERRO ')}: ${args.join(' ')}`;