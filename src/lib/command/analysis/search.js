// @flow

import XRegExp from 'xregexp';
import flattenDeep from 'lodash/flattenDeep';

import { 
  findAllCommand as findAllCommandRegex
} from '../../regex';

type TypeFindAllCommand = (string) => Array<string>;

export const findAllCommand : TypeFindAllCommand = (content) => {
  const result = XRegExp.matchRecursive(content, '{', '}\n?', 'gi', {
    valueNames: ['command', null, 'subcommand', null],
    escapeChar: '\\'
  });

  return result.reduce((acc, current) => {
    if (current.name === 'command') {
      acc = [...acc, ...flattenDeep(current.value.split('\n').map(value => {
        value = value.trim();
        if (value === '') return value;
        return value.match(findAllCommandRegex);
      }))];
    }

    if (current.name === 'subcommand' && acc.length > 0) {
      const index = acc.length - 1;
      acc[index] = `${acc[index]} {${current.value}}`;
    }

    return acc;

  }, []);
};