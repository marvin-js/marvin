export const repeat = (items = [], callback = f => f) => (execute) => {

  let promise = Promise.resolve();

  for (let i = 0, _len = items.length; i < _len; i++) {
    promise = promise.then(() => execute(callback(items[i], i)));
  }

  return promise;
};