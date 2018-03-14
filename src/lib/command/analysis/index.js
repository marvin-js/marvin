// @flow

import idx from 'idx'; 
import chalk from 'chalk';

import type { TypeLibExternal, TypeAction } from '../../../type-definitions';

import log from '../../log';
import { readFile } from '../../file';
import { pure } from '../helper';
import { transformValue } from '../../value';
import { checkPluginExternalExist } from '../../plugin';
import { isOption, setOption } from './option';
import { findAllCommand } from './search';
import { 
  isCommandWithSubCommand, 
  getNameWithSubCommand, 
  findVariables, 
  replaceVariables, 
  getVariables,
  isVariable,
  getSubCommand as getSubCommandRegex, 
  replaceSubCommand,
  findAllParamsAndOptions,
} from '../../regex';

type TypeOptionsExistCommand = {
  command: string,
  libExternal: TypeLibExternal,
  line: number,
};

type TypeExistCommand = (TypeOptionsExistCommand) => boolean;

const existCommand : TypeExistCommand = ({command, libExternal, line}) => {

  if (libExternal && !libExternal[command]) {

    if (checkPluginExternalExist(command)) return true;

    console.log(`\n${chalk.keyword('purple').inverse(` Ln ${line} `)}  ${chalk.red('✖')} Command '${command}' doesn't exist`);

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

type TypeResultSubCommands = {
  command: string,
  commands: Array<TypeAction>,
  nextLine: number,
};

type TypeGetSubCommands = ({command: string, line: number, libExternal: TypeLibExternal}) => TypeResultSubCommands;

const getSubCommand : TypeGetSubCommands = ({command, line, libExternal}) => {
  if (isCommandWithSubCommand.test(command)) {
    const subCommandsContent = getSubCommandRegex.exec(command)[1];

    return {
      command: command.replace(replaceSubCommand, ''),
      commands: subCommandsContent ? analyze({content: subCommandsContent, libExternal, lineReference: line - 1}) : [],
      nextLine: (subCommandsContent ? subCommandsContent.split('\n').length : 1) + line,
    };
  }

  return {
    command,
    commands: [],
    nextLine: line + 1,
  };
};

type TypeGetSetVariables = ({command: string}) => ({command: string, setVariables?: Array<string>});

const getSetVariables : TypeGetSetVariables = ({command}) => {
  if (findVariables.test(command)) {
    return {
      setVariables: [getVariables.exec(command)[1]],
      command: command.replace(replaceVariables, ''),
    };
  }

  return {
    command,
  };
};

type TypeResultGetParamsOptions = {
  options: {
    [string]: any,
    __hasReturn?: boolean,
  },
  args: Array<any>,
};

type TypeGetParamsOptions = ({command: string, setVariables?: Array<string>}) => TypeResultGetParamsOptions;

const getParamsOptions : TypeGetParamsOptions = ({command, setVariables}) => {
  const paramsAndOptionsMatched = command.match(findAllParamsAndOptions);
  let defaultParamsAndOptions : TypeResultGetParamsOptions = {args: [], options: {}};

  if (setVariables && setVariables.length > 0) {
    // $FlowFixMe
    defaultParamsAndOptions.options.__hasReturn = true;
  };

  return paramsAndOptionsMatched == null ? defaultParamsAndOptions : paramsAndOptionsMatched.reduce((acc, current, index) => {
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
};

type TypeProcessCommand = (TypeOptionsProcessCommand) => TypeAction | void;

export const processCommand : TypeProcessCommand = ({command, libExternal, line = 1} = {}) => {

  if (!command) return;

  const { command: newCommand, commands, nextLine } = getSubCommand({command, line, libExternal});
  const { command: newCommandLast, setVariables } = getSetVariables({command: newCommand});
  const { options, args } = getParamsOptions({command: newCommandLast, setVariables});

  const commandSplited = newCommandLast.split(' ') || [];
  const commandMain = idx(commandSplited, _ => _[0]) || '';

  existCommand({
    command: commandMain, 
    libExternal,
    line,
  });

  return {
    line,
    nextLine,
    command: commandMain,
    args: pure(args),
    options,
    setVariables,
    commands,
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