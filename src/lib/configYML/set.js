// @flow

import fs from 'fs';
import YAML from 'yamljs';

import type { TypeConfigMarvin } from '../../type-definitions';

import { getPath } from './helpers';

type TypeSet = (TypeConfigMarvin) => void;

const set : TypeSet = (config) => {
  fs.writeFileSync(getPath(), YAML.stringify(config), 'utf8');
};

export default set;