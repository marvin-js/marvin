import mkdirp from 'mkdirp';
import fs from 'fs';
import { dirname } from 'path';

export default function (opts = {}, path, ...contents) {

  const pathDirname = opts.dir ? path : dirname(path);

  return new Promise((resolve, reject) => {
    mkdirp(pathDirname, function (err) {
      if (opts.dir) {
        resolve(pathDirname);
        return;
      }
  
      fs.writeFileSync(path, contents.join(''), 'utf8');
      resolve(path);
    });
  });
}