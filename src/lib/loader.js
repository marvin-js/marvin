// @flow

import path from 'path';

type TypeOptionsLoader = {
  pathModule?: string,
  name: string,
  isLocal?: boolean,
};

type TypeLoader = (TypeOptionsLoader) => any;

export const loader : TypeLoader = ({pathModule, name, isLocal} = {}) => isLocal ? require(path.resolve(pathModule, name)) : require('requireg')(name);