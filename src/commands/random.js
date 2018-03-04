const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

export default function (opts, ...args) {
  return args[getRandomInt(args.length)];
}