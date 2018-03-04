export default function (opts, ...args) {
  return args.map(arg => arg.toLowerCase()).join(' ');
}