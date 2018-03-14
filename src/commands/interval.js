import { resolve } from "dns";

export default function (opts = {}, milliseconds) {
  return execute => {

    let count = 0;

    return new Promise(resolve => {
      const id = setInterval(() => {
        execute();
        count = count + 1;

        if (opts.count > 0 && count >= opts.count) {
          clearInterval(id);
          resolve();
        }
      }, milliseconds);
    });
  };
}