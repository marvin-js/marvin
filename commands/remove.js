import fs from 'fs-extra';

export default function (opts, path) {
  return fs.remove(path);
}