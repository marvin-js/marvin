import mkdirp from 'mkdirp';
import fs from 'fs';
import { dirname } from 'path';

export function writeFile (path, contents, cb) {
  mkdirp(dirname(path), function (err) {
    if (err) return cb(err);

    fs.writeFileSync(path, contents, 'utf8');
    cb && cb();
  });
}