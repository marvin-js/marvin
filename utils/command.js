import idx from 'idx';

import { readFile } from './file';

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

  if (!command) return;

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
    args: config.args,
    options: config.options,
  };
};

export function processCommandFile (fileToExecute) {
  return new Promise(resolve => {

    const actions = [];

    readFile(fileToExecute, {
      eachLine: line => {
        actions.push(processCommand(line));
      },
      onClose: () => {
        resolve(actions);
      },
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