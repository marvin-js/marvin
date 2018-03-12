import idx from 'idx';
import { repeat } from '../helpers';

export default (opts, ...items) => {
  if (items.length === 1) {
    const value = idx(items, _ => items[0]);
    if (typeof value === 'array' || value.length > 0) {
      return repeat(value);
    }
  }

  return repeat(items);
};
