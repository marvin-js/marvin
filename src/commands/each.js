import idx from 'idx';
import { repeat } from '../helpers';

export default (opts, ...items) => {

  if (items.length === 1) {
    const value = idx(items, _ => items[0]);
    if (typeof value === 'array') {
      return repeat(value);
    }
  }

  return repeat(items);
}
