import { warn } from '../helpers';

export default function (opts, ...args) {
  console.log(warn(...args));
}