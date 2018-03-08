#!/usr/bin/env node

import 'babel-polyfill';
import program from 'commander';
import chalk from 'chalk';
import idx from 'idx';
import path from 'path';

import packageJSON from '../../package.json';
import { runFile } from '../lib/command';
import { findFileWorkflow } from '../lib/workflow-file';
import * as libExternals from '../commands';

program
  .version(packageJSON.version)
  .usage('[options] [file ...]')
  .description('Create a complex workflow in a simpler way')
  .option('-d --dir <dir>', 'Root directory where files marvins will be search')
  .on('--help', () => {
    console.log();
    console.log();
    console.log('  How use the Marvin, step-by-step:');
    console.log();
    console.log();
    console.log(`    ${chalk.bgRed(' 1. ')}: Create um file with name .marvin and these content below`);
    console.log();
    console.log('          $content = watch ./src/file --async {');
    console.log('            log file changed');
    console.log('          }');
    console.log();
    console.log();
    console.log(`    ${chalk.bgRed(' 2. ')}: Run the file`);
    console.log();
    console.log('          marvin');
    console.log();
    console.log();
    console.log();
  })
  .parse(process.argv);

runFile(findFileWorkflow(program.args, {
  exitOnError: true,
  dir: program.dir,
}), libExternals);


