import fs from 'fs';

export default function (opts, path) {
  try {
    return fs.existsSync(path);
  } catch (e) {
    return false;
  }
}