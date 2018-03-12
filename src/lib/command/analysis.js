// @flow

import idx from 'idx'; 
import XRegExp from 'xregexp';
import chalk from 'chalk';
import flattenDeep from 'lodash/flattenDeep';

import type { TypeLibExternal, TypeAction } from '../../type-definitions';

import log from '../log';
import { readFile } from '../file';
import { pure } from './helper';
import { transformValue } from '../value';
import { checkPluginExternalExist } from '../plugin';
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

function isOption (value : string) : boolean {
  return value.indexOf('--') !== -1;
};

type TypeCallbackSetOption = (string, any) => void; 

type TypeSetOption = (string, callback? : TypeCallbackSetOption) => void;

const setOption : TypeSetOption = (option, callback) => {

  const indexSet = option.indexOf('=');
  const hasValue = indexSet !== -1;

  const name = option.substring(2, hasValue ? indexSet : option.length);
  const value = option.substring(indexSet + 1, option.length);

  callback && callback(name, hasValue ? value : true);
};

type TypeFindAllCommand = (string) => Array<string>;

export const findAllCommand : TypeFindAllCommand = (content) => {
  const result = XRegExp.matchRecursive(content, '{', '}\n?', 'gi', {
    valueNames: ['command', null, 'subcommand', null],
    escapeChar: '\\'
  });

  return result.reduce((acc, current) => {
    if (current.name === 'command') {
      acc = [...acc, ...flattenDeep(current.value.split('\n').map(value => {
        value = value.trim();
        if (value === '') return value;
        return value.match(findAllCommandRegex);
      }))];
    }

    if (current.name === 'subcommand' && acc.length > 0) {
      const index = acc.length - 1;
      acc[index] = `${acc[index]} {${current.value}}`;
    }

    return acc;

  }, []);
};

type TypeExistCommand = (string, TypeLibExternal) => boolean;

const existCommand : TypeExistCommand = (command, libExternal) => {

  if (libExternal && !libExternal[command]) {

    if (checkPluginExternalExist(command)) return true;

    console.log(`\n${chalk.red('✖')} Command '${command}' doesn't exist`);

    if (process.env.NODE_ENV === 'test') {
      return false;
    } else {
      process.exit(1);
    }
  }

  return true;
};

type TypeOptionsProcessCommand = {
  command: string,
  libExternal: TypeLibExternal,
  line?: number,
};

type TypeProcessCommand = (TypeOptionsProcessCommand) => TypeAction | void;

export const processCommand : TypeProcessCommand = ({command, libExternal, line = 1} = {}) => {

  let subCommandsContent;
  let setVariables;

  if (isCommandWithSubCommand.test(command)) {
    subCommandsContent = getSubCommand.exec(command)[1];
    command = command.replace(replaceSubCommand, '');
  }

  if (!command) return;

  const subCommandsProcessed = subCommandsContent ? analyze({content: subCommandsContent, libExternal, lineReference: line - 1}) : [];

  if (findVariables.test(command)) {
    setVariables = [getVariables.exec(command)[1]];
    command = command.replace(replaceVariables, '');
  }

  const commandSplited = command.split(' ') || [];
  const commandMain = idx(commandSplited, _ => _[0]) || '';
  const paramsAndOptionsMatched = command.match(findAllParamsAndOptions);
  const defaultParamsAndOptions = {args: [], options: {}};

  const config = paramsAndOptionsMatched == null ? defaultParamsAndOptions : paramsAndOptionsMatched.reduce((acc, current, index) => {
    if (index === 0) return acc;

    if (isOption(current)) {
      setOption(current, (name, value) => {
        acc.options[name] = transformValue(value);
      });
    } else {
      acc.args.push(transformValue(current));
    }

    return acc;
  }, defaultParamsAndOptions);

  if (setVariables && setVariables.length > 0) {
    config.options.__hasReturn = true;
  }

  existCommand(commandMain, libExternal);

  return {
    line,
    nextLine: (subCommandsContent ? subCommandsContent.split('\n').length : 1) + line,
    command: commandMain,
    args: pure(config.args),
    options: config.options,
    setVariables,
    commands: subCommandsProcessed,
  };
};

type TypeOptionsAnalyze = {
  content: string,
  libExternal: TypeLibExternal,
  lineReference?: number,
};

type TypeAnalyze = TypeOptionsAnalyze => Array<TypeAction>;

const analyze : TypeAnalyze = ({content, libExternal, lineReference = 0}) => {
  return findAllCommand(content).reduce((acc, command, lineCommand) => {
    command = command.trim();
    if (command === '') return acc;
    const action = processCommand({command, libExternal, line: (lineCommand + 1) + lineReference});
    if (!action) return acc;
    if (action.commands.length > 0) {
      lineReference = action.nextLine - action.line - 1 + lineReference;
    }
    acc.push(action);
    return acc;
  }, []);
};

type TypeProcessCommandFile = (string, TypeLibExternal) => Promise<Array<TypeAction>>;

export const processCommandFile : TypeProcessCommandFile = async (fileToExecute, libExternal) => {
  const updateFile = log.draft(`Read file: ...`);
  const content = await readFile(fileToExecute);
  updateFile(`${chalk.green('✔')} Read file: ok`);
  const updateAnalysis = log.draft(`Scan file: ...`);
  const actions = analyze({content, libExternal});
  updateAnalysis(`${chalk.green('✔')} Scan file: ok`);
  return actions;
};