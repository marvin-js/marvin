import fs from 'fs';
import streamToPromise from 'stream-to-promise';

export default function (opts, origin, dest) {
  const writeStream = fs.createWriteStream(dest);
  const promise = streamToPromise(writeStream);
  fs.createReadStream(origin).pipe(writeStream);
  return promise.then(() => dest);
};