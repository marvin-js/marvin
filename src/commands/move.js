import fs from 'fs';

export default function (opts, origin, dest) {
  fs.rename(origin, dest, function (err) {
    if (err) throw err;
  });
};