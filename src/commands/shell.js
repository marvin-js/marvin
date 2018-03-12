import shell from 'shelljs';

export default async function (opts, ...args) {
  return !shell.exec(args.join(' ')).code;
};