export default function (opts, count) {
  return execute => {
    let promise = Promise.resolve();

    for (let i = 0; i < count; i++) {
      promise = promise.then(() => execute(i + 1));
    }
    
    return promise;
  }
}