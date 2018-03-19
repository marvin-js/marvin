// @flow

import YAML from 'yamljs';

import type { TypeConfigMarvin } from '../../type-definitions';

import { getPath } from './helpers';

type TypeGet = () => TypeConfigMarvin;

const get : TypeGet = () => {

  const configDefault = {
    packet: [],
  };

  try {
    const config = YAML.load(getPath());

    if (config === null) return configDefault;

    return config;
  } catch (e) {
    return configDefault;
  }
};

export default get;
