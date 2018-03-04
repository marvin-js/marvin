import fs from 'fs';

export default function (opts, path) {
  return new Promise(resolve => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
}