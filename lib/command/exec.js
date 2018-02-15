import uuid from 'uuid';

import PubSub, { REGISTER_ASYNC, FINISH_ASYNC, ALL_PROCESS_FINISH, VERIFY_ALL_PROCESS } from '../pubsub';
import { isVariable } from '../regex';

const idsPubSub = [];

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
  if (action.commands.length > 0) return generateCommand(action.commands, opts)()
  return Promise.resolve();
};

export const repeat = (items = [], callback = f => f) => (execute) => {

  let promise = Promise.resolve();

  for (let i = 0, _len = items.length; i < _len; i++) {
    promise = promise.then(() => execute(callback(items[i], i)));
  }

  return promise;
};

const executeAfterAction = (action, opts) => (result) => {
  setResultVariables(result, action, opts.store);
  return executeSubCommands(action, opts);
};

const executeAction = (action, opts, idChain) => {

  if (!action) return Promise.resolve();

  const id = uuid.v1();
  const pubSub = idsPubSub[idChain]
  let promiseWrapper = Promise.resolve();

  if (action.options.async) promiseWrapper = promiseWrapper.then((result) => pubSub.publish(REGISTER_ASYNC, { id }).then(() => result));

  promiseWrapper = promiseWrapper.then(() => {
    const resultVariables = getResultVariables(action.options, action.args, opts.store);
    const resultCommand = opts.libExternal[action.command].call({}, resultVariables.options, ...resultVariables.args);
    const isFunctionResultCommand = typeof resultCommand === 'function';
    const result = isFunctionResultCommand ? resultCommand(executeAfterAction(action, opts)) : resultCommand;

    let returnAction = !result ? Promise.resolve() : (result.then ? result : Promise.resolve(result));
  
    if (!isFunctionResultCommand) returnAction = returnAction.then(executeAfterAction(action, opts));

    if (action.options.async) {
      returnAction = returnAction.then(() => pubSub.publish(FINISH_ASYNC, id));
      return Promise.resolve();
    }

    return returnAction;
  });

  return promiseWrapper;
};

const getActionsInGenerator = function*(actions, opts) {
  for (let i = 0, _len = actions.length; i < _len; i++) {
    yield {action: actions[i], opts};
  };
};

export const mountChainCommand = (actions = [], opts = {}, idChain) => async () => {

  let promise = Promise.resolve();

  for (let conf of getActionsInGenerator(actions, opts)) { 
    promise = promise.then(() => {
      return executeAction(conf.action, conf.opts, idChain)
    });
  }

  return promise;
};

export const wrapperInstanceGenerator = (callback, idChain) => async () => {

  if (!callback) return Promise.resolve();
  const pubSub = idsPubSub[idChain];

  await callback();

  return new Promise(resolve => {
    pubSub.on(ALL_PROCESS_FINISH, resolve);
    pubSub.publish(VERIFY_ALL_PROCESS);
  });
};

export const generateCommand = (actions = [], opts = {}) => {
  const idChain = uuid.v1();
  idsPubSub[idChain] = new PubSub();
  return wrapperInstanceGenerator(mountChainCommand(actions, opts, idChain), idChain);
}