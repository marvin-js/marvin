export default function (opts, variable, value) {
  if (variable && value) {
    process.env[variable] = value;
    return value;
  }

  if (variable) {
    return process.env[variable];
  }
} 