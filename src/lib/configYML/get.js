// @flow

import YAML from 'yamljs';

import type { TypeConfigMarvin } from '../../type-definitions';

import { getPath } from './helpers';

type TypeGet = () => TypeConfigMarvin;

const get : TypeGet = () => {
  const config = YAML.load(getPath());

  if (config === null) return {
    packet: [],
  };

  return config;
};

export default get;
