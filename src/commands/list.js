import shell from 'shelljs';

export default async function (opts, path = '') {
  return shell.ls(path);
};