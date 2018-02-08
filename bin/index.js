#!/usr/bin/env node

import 'babel-polyfill';
import program from 'commander';
import idx from 'idx';

import packageJSON from '../package.json';
import { runFile } from '../utils/command';
import * as libExternals from '../commands';

program
  .version(packageJSON.version)
  .parse(process.argv);

const fileToExecute = idx(program, _ => _.args[0]) || '.workflow';

runFile(fileToExecute, libExternals);


