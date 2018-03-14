#!/usr/bin/env node

import 'babel-polyfill';
import program from 'commander';
import idx from 'idx';
import path from 'path';

import packageJSON from '../../package.json';
import { runFile } from '../lib/command';
import { findFileWorkflow } from '../lib/workflow-file';
import help from './help';
import * as libExternals from '../commands';

program
  .version(packageJSON.version, '-v, --version')
  .usage('[options] [file ...]')
  .description('Create a complex workflow in a simpler way')
  .option('-d --dir <dir>', 'root directory where files marvins will be search')
  .on('--help', help);

program.parse(process.argv);

runFile(findFileWorkflow(program.args, {
  exitOnError: true,
  dir: program.dir,
}), libExternals);


