// @flow

import type { TypeAction, OptionsExec } from '../../../type-definitions';

import uuid from 'uuid';

import PubSub, { REGISTER_ASYNC, FINISH_ASYNC, ALL_PROCESS_FINISH, VERIFY_ALL_PROCESS } from '../../pubsub';
import { setResultVariables, getResultVariables } from './variables';
import { loadPluginExternal } from '../../plugin';

const idsPubSub : {[key: string]: Object} = {};

const executeSubCommands = (action : TypeAction, opts : OptionsExec) => {
  if (action.commands.length > 0) return generateCommand(action.commands, opts)();
  return Promise.resolve();
};

const executeAfterAction = (action : TypeAction, opts : OptionsExec) => (result) => {
  setResultVariables(result, action, opts.store);

  if (result === false) {
    return Promise.resolve();
  }

  return executeSubCommands(action, opts);
};

type TypeGetCommand = (OptionsExec, string) => (Function | boolean);

const getCommand : TypeGetCommand = (opts, command) => {
  const commandExternal = opts.libExternal[command];

  if (!commandExternal) return loadPluginExternal(command);

  return commandExternal;
};

const executeAction = (action : TypeAction, opts : OptionsExec, idChain) => {

  if (!action) return Promise.resolve();

  const id = uuid.v1();
  const pubSub = idsPubSub[idChain];
  let promiseWrapper = Promise.resolve();

  if (action.options.async) promiseWrapper = promiseWrapper.then((result) => pubSub.publish(REGISTER_ASYNC, { id }).then(() => result));

  promiseWrapper = promiseWrapper.then(() => {
    const resultVariables = getResultVariables(action.options, action.args, opts.store);
    const command = getCommand(opts, action.command);
    const resultCommand = typeof command === 'function' ? command.call({}, resultVariables.options, ...resultVariables.args) : command;
    const result = typeof resultCommand === 'function' ? resultCommand(executeAfterAction(action, opts)) : resultCommand;

    let returnAction : Promise<*> = result === undefined ? Promise.resolve() : (typeof result !== 'boolean' && result.then ? result : Promise.resolve(result));
  
    if (typeof resultCommand !== 'function') returnAction = returnAction.then(executeAfterAction(action, opts));

    if (action.options.async) {
      returnAction = returnAction.then(() => pubSub.publish(FINISH_ASYNC, id));
      return Promise.resolve();
    }

    return returnAction;
  });

  return promiseWrapper;
};

const getActionsInGenerator = function*(actions : Array<TypeAction>, opts : OptionsExec) {
  for (let i = 0, _len = actions.length; i < _len; i++) {
    yield {action: actions[i], opts};
  };
};

const mountChainCommand = (actions : Array<TypeAction> = [], opts : OptionsExec, idChain) => async () => {

  let promise = Promise.resolve();

  for (let conf of getActionsInGenerator(actions, opts)) { 
    promise = promise.then(() => {
      return executeAction(conf.action, conf.opts, idChain);
    });
  }

  return promise;
};

type TypeWrapperInstanceGenerator = (() => Promise<*>, string) => () => Promise<*>;

const wrapperInstanceGenerator : TypeWrapperInstanceGenerator = (callback, idChain) => async () => {

  if (!callback) return Promise.resolve();
  const pubSub = idsPubSub[idChain];

  await callback();

  return new Promise(resolve => {
    pubSub.on(ALL_PROCESS_FINISH, resolve);
    pubSub.publish(VERIFY_ALL_PROCESS);
  });
};

type TypeGenerateCommand =  (Array<TypeAction>, OptionsExec) => Function;

export const generateCommand : TypeGenerateCommand = (actions = [], opts) => {
  const idChain = uuid.v1();
  idsPubSub[idChain] = new PubSub();
  return wrapperInstanceGenerator(mountChainCommand(actions, opts, idChain), idChain);
};