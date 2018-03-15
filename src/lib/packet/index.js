// @flow
import path from 'path';

import type { TypeLibExternal } from '../../type-definitions';

import { loader } from '../loader';
import { load as loadConfig, getPathRootConfig } from '../configYML';

type TypeLoadPacket = ({libExternal: TypeLibExternal}) => TypeLibExternal;

export const loadPacket : TypeLoadPacket = ({libExternal = {}} = {}) => {

  const config = loadConfig();

  config.packet && config.packet.forEach(packet => {
    const packetLoaded = loader({
      pathModule: packet.isLocal ? path.resolve(getPathRootConfig(), packet.path) : '',
      name: packet.name,
      isLocal: packet.isLocal,
    });

    if (typeof packetLoaded === 'object') {
      Object.keys(packetLoaded).forEach(key => {
        libExternal[key] = packetLoaded[key];
      });
    }
  });

  return libExternal;
};
