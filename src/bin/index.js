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

program.command('init', 'create a .marvin.yml. case the command is global, the file will created on $HOME, otherwhise on project root')

program.parse(process.argv);

const firstParam = idx(program, _ => _.args[0]) || '';

if (firstParam !== 'init') {
  runFile(findFileWorkflow(program.args, {
    exitOnError: true,
    dir: program.dir,
  }), libExternals);
}


