import idx from 'idx';
import XRegExp from 'xregexp';

import { readFile } from './file';
import { 
  isCommandWithSubCommand, 
  getNameWithSubCommand, 
  findVariables, 
  replaceVariables, 
  getVariables,
  isVariable,
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

const setResultVariables = (result, action, store) => {
  if (action.setVariables && action.setVariables.length > 0) {
    store.setStore(action.setVariables[0], result);
  }
};

const getResultVariables = (options, args = [], store) => {

  const newOptions = Object.entries(options).reduce((acc, [key, value]) => {

    if (typeof value === 'string' && isVariable.test(value)) {
      acc[key] = store.getStore(value);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});

  const newArgs = args.map(value => {
    if (typeof value === 'string' && isVariable.test(value)) {
      return store.getStore(value);
    } else {
      return value;
    }
  });

  return {
    options: newOptions,
    args: newArgs,
  };
};

const executeSubCommands = (action, opts) => {
  if (action.commands.length > 0) {
    return generateCommand(action.commands, opts)();
  }

  return Promise.resolve();
};

const executeAction = (action, opts) => {

  if (!action) return Promise.resolve();

  const resultVariables = getResultVariables(action.options, action.args, opts.store);

  const result = opts.libExternal[action.command].call({}, resultVariables.options, ...resultVariables.args);

  let returnAction = !result ? Promise.resolve() : (result.then ? result : Promise.resolve(result));

  returnAction = returnAction.then(result => {
    setResultVariables(result, action, opts.store);
    return executeSubCommands(action, opts);
  });

  if (action.options.async) {
    return Promise.resolve();
  }

  return returnAction;
};

const getActionsInGenerator = function*(actions, opts) {
  for (let i = 0, _len = actions.length; i < _len; i++) {
    yield {action: actions[i], opts};
  };
};

export const generateCommand = (actions = [], opts = {}) => () => {

  let promise = Promise.resolve();

  for (let conf of getActionsInGenerator(actions, opts)) { 
    promise = promise.then(() => {
      return executeAction(conf.action, conf.opts)
    });
  }

  return promise;
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