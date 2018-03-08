import idx from 'idx';
import XRegExp from 'xregexp';
import chalk from 'chalk';

import log from '../log';
import { readFile } from '../file';
import { pure } from './helper';
import { transformValue } from '../value';
import { 
  isCommandWithSubCommand, 
  getNameWithSubCommand, 
  findVariables, 
  replaceVariables, 
  getVariables,
  isVariable,
  getSubCommand, 
  replaceSubCommand,
  findAllParamsAndOptions,
  findAllCommand as findAllCommandRegex
} from '../regex';

function isOption (value) {
  return value.indexOf('--') !== -1
};

function setOption (option, callback = f => f) {

  const indexSet = option.indexOf('=');
  const hasValue = indexSet !== -1;

  const name = option.substring(2, hasValue ? indexSet : option.length);
  const value = option.substring(indexSet + 1, option.length);

  callback(name, hasValue ? value : true);
};

export const findAllCommand = (content) => {
  const result = XRegExp.matchRecursive(content, '{', '}', 'gi', {
    valueNames: ['command', null, 'subcommand', null],
    escapeChar: '\\'
  });

  return result.reduce((acc, current) => {
    if (current.name === 'command') {
      acc = [...acc, ...current.value.match(findAllCommandRegex)];
    }

    if (current.name === 'subcommand' && acc.length > 0) {
      const index = acc.length - 1;
      acc[index] = `${acc[index]} {\n${current.value}\n}`;
    }

    return acc;

  }, []);
};

function existCommand (command, libExternal) {

  if (libExternal && !libExternal[command]) {

    const pluginExternal = require('requireg')(`marvin-${command}`);

    if (pluginExternal && typeof pluginExternal === 'function') {
      return true;
    }

    console.log(`\n${chalk.red('✖')} Command '${command}' doesn't exist`)

    if (process.env.NODE_ENV === 'test') {
      return false;
    } else {
      process.exit(1);
    }
  }

  return true;
};

export function processCommand (command, libExternal) {

  let subCommands;
  let setVariables;

  if (isCommandWithSubCommand.test(command)) {
    subCommands = pure(findAllCommand(getSubCommand.exec(command)[1]));

    command = command.replace(replaceSubCommand, '');
  }

  if (!command) return;

  const subCommandsProcessed = subCommands ? subCommands.map(subCommand => processCommand(subCommand, libExternal)) : [];

  if (findVariables.test(command)) {
    setVariables = [getVariables.exec(command)[1]];
    command = command.replace(replaceVariables, '');
  }

  const commandSplited = command.split(' ') || [];

  const commandMain = idx(commandSplited, _ => _[0]);

  const config = command.match(findAllParamsAndOptions).reduce((acc, current, index) => {
    if (index === 0) return acc;

    if (isOption(current)) {
      setOption(current, (name, value) => {
        acc.options[name] = transformValue(value);
      });
    } else {
      acc.args.push(transformValue(current));
    }

    return acc;
  }, {args: [], options: {}});

  if (setVariables && setVariables.length > 0) {
    config.options.__hasReturn = true;
  }

  existCommand(commandMain, libExternal);

  return {
    command: commandMain,
    args: pure(config.args),
    options: config.options,
    setVariables,
    commands: subCommandsProcessed,
  };
};

export async function processCommandFile (fileToExecute, libExternal) {
  const updateFile = log.draft(`Read file: ...`);
  const content = await readFile(fileToExecute);
  updateFile(`${chalk.green('✔')} Read file: ok`);
  const updateAnalysis = log.draft(`Scan file: ...`);
  const actions = pure(findAllCommand(content)).map(command => processCommand(command, libExternal));
  updateAnalysis(`${chalk.green('✔')} Scan file: ok`);
  return actions;
};