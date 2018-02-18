import test from 'ava';
import chalk from 'chalk';

import { info, erro, warn } from './log';

test('info', t => {
  t.is(info('teste'), `${chalk.bgBlue(' INFO ')}: teste`);
});

test('info without args', t => {
  t.is(info(), `${chalk.bgBlue(' INFO ')}: `);
});

test('erro', t => {
  t.is(erro('teste'), `${chalk.bgRed(' ERRO ')}: teste`);
});

test('erro without args', t => {
  t.is(erro(), `${chalk.bgRed(' ERRO ')}: `);
});

test('warn', t => {
  t.is(warn('teste'), `${chalk.keyword('orange').inverse(' WARN ')}: teste`);
});

test('warn without args', t => {
  t.is(warn(), `${chalk.keyword('orange').inverse(' WARN ')}: `);
});