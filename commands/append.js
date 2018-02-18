import fs from 'fs';

export default function (opts, file, ...args) {
  return new Promise(resolve => {
    const newContent = args.join('');
    fs.appendFile(file, newContent, function (err) {
      if (err) throw err;

      if (opts.__hasReturn) {
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) throw err;
          resolve(data);
        });
      } else {
        resolve();
      }
    });
  });
};