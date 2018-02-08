import fs from 'fs';

export function readFile (inputFile, options = {}) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, 'utf8', function(err, content) {
      if (err) reject(err);
      resolve(content);
    });
  });
}