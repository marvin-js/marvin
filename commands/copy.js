import fs from 'fs';

export default function (opts, origin, dest) {
  fs.createReadStream(origin).pipe(fs.createWriteStream(dest));
};