import { transformValue } from './value';

const regexLabel = /(.[^:]+):(.+)/i;

export function readAsLabel (params = []) {
  return params.reduce((acc, current) => {
    const result = regexLabel.exec(current);
    acc[result[1]] = transformValue(result[2]);
    return acc;
  }, {});
}