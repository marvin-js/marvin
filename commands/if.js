export default function (opts, ...args) {
  try {
    return !!eval(args.join(' '));
  } catch (e) {
    return false;
  }
}