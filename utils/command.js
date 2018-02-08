import idx from 'idx';

import { readFile } from './file';
import { isCommandWithSubCommand, getNameWithSubCommand, findAllCommand } from './regex';

export function pure (commands = []) {
  if (commands === null) return [];

  return commands.map(command => command.trim()).filter(command => command !== '');
};

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

export function processCommand (command) {

  let subCommands;

  if (isCommandWithSubCommand.test(command)) {
    subCommands = pure((idx(command, _ => _.match(isCommandWithSubCommand)[0]) || '').match(findAllCommand));
    command = idx(command, _ => _.match(getNameWithSubCommand)[0]);
  }

  if (!command) return;

  const subCommandsProcessed = subCommands ? subCommands.map(subCommand => processCommand(subCommand)) : [];

  command = command.split(' ') || [];

  const commandMain = idx(command, _ => _[0]);

  const config = command.reduce((acc, current, index) => {
    if (index === 0) return acc;

    if (isOption(current)) {
      setOption(current, (name, value) => {
        acc.options[name] = value;
      });
    } else {
      acc.args.push(current);
    }

    return acc;
  }, {args: [], options: {}});

  return {
    command: commandMain,
    args: pure(config.args),
    options: config.options,
    commands: subCommandsProcessed,
  };
};

export function processCommandFile (fileToExecute) {
  return new Promise(resolve => {

    const actions = [];

    readFile(fileToExecute)
      .then(content => {
        pure(content.match(findAllCommand)).forEach(command => actions.push(processCommand(command)));
        resolve(actions);
      });
  });
};

export function generateCommand (actions = [], libExternal = {}) {
  return actions.map(action => {
    return libExternal[action.command].bind({}, action.options, ...action.args);
  });
};

export function runFile (fileToExecute, libExternal) {
  return processCommandFile(fileToExecute).then(actions => {
    const actionsGenerated = generateCommand(actions, libExternal);
    actionsGenerated.forEach(action => action());
  });
};