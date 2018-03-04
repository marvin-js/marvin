export default async function (opts, value) {
  return value.replace(/(^|\s)\S/g, l => l.toUpperCase());
};