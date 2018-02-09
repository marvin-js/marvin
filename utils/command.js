import idx from 'idx';

import { readFile } from './file';
import { isCommandWithSubCommand, getNameWithSubCommand, findAllCommand, findVariables, replaceVariables, getVariables, getSubCommand, replaceSubCommand } from './regex';

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
  let setVariables;

  if (isCommandWithSubCommand.test(command)) {
    subCommands = pure((idx(command, _ => _.match(getSubCommand)[0]) || '').match(findAllCommand));
    command = command.replace(replaceSubCommand, '');
  }

  if (!command) return;

  const subCommandsProcessed = subCommands ? subCommands.map(subCommand => processCommand(subCommand)) : [];

  if (findVariables.test(command)) {
    setVariables = [getVariables.exec(command)[1]];
    command = command.replace(replaceVariables, '');
  }

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
    setVariables,
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
  return () => {
    actions.map(async action => {

      const executeSubCommands = () => {
        if (action.commands.length > 0) {
          generateCommand(action.commands, libExternal)();
        }
      };

      const executeAction = () => {
        const promise = libExternal[action.command].call({}, action.options, ...action.args);

        if (!promise) return Promise.resolve();
        
        if (promise.then) {
          return promise;
        } else {
          return Promise.resolve(promise);
        }
      };

      if (action.options.async) {
        executeAction().then(result => {
          executeSubCommands();
        });
      } else {
        const result = await executeAction();
        executeSubCommands();
      }
    });

    return Promise.resolve();
  }
};

export function runFile (fileToExecute, libExternal) {
  return processCommandFile(fileToExecute).then(actions => {
    const execute = generateCommand(actions, libExternal);
    return execute();
  });
};