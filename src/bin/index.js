#!/usr/bin/env node

import 'babel-polyfill';
import program from 'commander';
import chalk from 'chalk';
import idx from 'idx';
import path from 'path';

import packageJSON from '../../package.json';
import { runFile } from '../lib/command';
import * as libExternals from '../commands';

program
  .version(packageJSON.version)
  .command('workflow')
  .usage('[file ...] [options]')
  .description('Create a complex workflow in a simpler way')
  .option('--silent', 'silent log')
  .on('--help', () => {
    console.log();
    console.log();
    console.log('  How use the workflow, step-by-step:');
    console.log();
    console.log();
    console.log(`    ${chalk.bgRed(' 1. ')}: Create um file with name .workflow and these content below`);
    console.log();
    console.log('          $content = watch ./src/file --async {');
    console.log('            log file changed');
    console.log('          }');
    console.log();
    console.log();
    console.log(`    ${chalk.bgRed(' 2. ')}: Run the file`);
    console.log();
    console.log('          worflow');
    console.log();
    console.log();
    console.log();
  })
  .parse(process.argv);

const fileToExecute = idx(program, _ => _.args[0]) || '.workflow';
const pathComplete = path.resolve(process.cwd(), fileToExecute);

runFile(pathComplete, libExternals);


