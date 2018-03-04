import { isVariable } from '../../regex';

export const setResultVariables = (result, action, store) => {

  if (!action || !store) return;

  if (action.setVariables && action.setVariables.length > 0) {
    store.setStore(action.setVariables[0], result);
  }
};

export const getResultVariables = (options = {}, args = [], store) => {

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