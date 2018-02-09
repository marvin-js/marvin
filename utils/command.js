import idx from 'idx';
import XRegExp from 'xregexp';

import { readFile } from './file';
import { 
  isCommandWithSubCommand, 
  getNameWithSubCommand, 
  findVariables, 
  replaceVariables, 
  getVariables, 
  getSubCommand, 
  replaceSubCommand,
  findAllCommand as findAllCommandRegex
} from './regex';

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

export function processCommand (command) {

  let subCommands;
  let setVariables;

  if (isCommandWithSubCommand.test(command)) {
    subCommands = pure(findAllCommand(getSubCommand.exec(command)[1]));

    command = command.replace(replaceSubCommand, '');
  }

  if (!command) return;

  const subCommandsProcessed = subCommands ? subCommands.map(subCommand => processCommand(subCommand)) : [];

  if (findVariables.test(command)) {
    setVariables = [getVariables.exec(command)[1]];
    command = command.replace(replaceVariables, '');
  }

  const commandSplited = command.split(' ') || [];

  const commandMain = idx(commandSplited, _ => _[0]);

  const config = commandSplited.reduce((acc, current, index) => {
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

export async function processCommandFile (fileToExecute) {
  const actions = [];
  const content = await readFile(fileToExecute);
  pure(findAllCommand(content)).forEach(command => actions.push(processCommand(command)));
  return actions;
};

export const generateCommand = (actions = [], opts = {}) => () => {
  actions.map(async action => {

    const executeSubCommands = () => {
      if (action.commands.length > 0) {
        generateCommand(action.commands, opts)();
      }
    };

    const setResultVariables = (result, action, store) => {
      if (action.setVariables && action.setVariables.length > 0) {
        store.setStore(action.setVariables[0], result);
      }
    };

    const executeAction = () => {
      const promise = opts.libExternal[action.command].call({}, action.options, ...action.args);

      if (!promise) return Promise.resolve();
      
      if (promise.then) {
        return promise;
      } else {
        return Promise.resolve(promise);
      }
    };

    if (action.options.async) {
      executeAction().then(result => {
        setResultVariables(result, action, opts.store);
        executeSubCommands();
      });
    } else {
      const result = await executeAction();
      setResultVariables(result, action, opts.store);
      await executeSubCommands();
    }
  });

  return Promise.resolve();
};

export function runFile (fileToExecute, libExternal) {
  return processCommandFile(fileToExecute).then(actions => {
    let store = {};
    const execute = generateCommand(actions, {
      libExternal,
      store: {
        setStore: (name, value) => {
          store[name] = value;
        },
        getStore: (name) => store[name],
      },
    });
    return execute();
  });
};