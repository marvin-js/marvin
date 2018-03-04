import mkdirp from 'mkdirp';
import fs from 'fs';
import { dirname } from 'path';

export function writeFile (path, contents) {
  return new Promise((resolve, reject) => {
    mkdirp(dirname(path), function (err) {
      if (err) return reject(err);
  
      fs.writeFileSync(path, contents, 'utf8');
      resolve()
    });
  });
}

export function readFile (inputFile, options = {}) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, 'utf8', function(err, content) {
      if (err) reject(err);
      resolve(content);
    });
  });
}