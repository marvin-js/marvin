const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

export function readFile (inputFile, options = {}) {
  const instream = fs.createReadStream(inputFile);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);

  rl.on('line', function (line) {
    options.eachLine && options.eachLine(line);
  });

  rl.on('close', function (line) {
    options.onClose && options.onClose(line);
  });
}