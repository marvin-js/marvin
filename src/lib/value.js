import { 
  isText,
  isBoolean,
  isNumber,
} from './regex';

export function transformValue (value) {

  if (typeof value === 'boolean') return value
  if (isText.exec(value)) return value.replace(isText, '\$1\$2');
  if (isBoolean.exec(value)) return value === 'true';
  if (isNumber.exec(value)) return parseInt(value);

  return value;
};