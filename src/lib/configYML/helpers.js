// @flow

import isInstalledGlobally from 'is-installed-globally';
import path from 'path';
import findRoot from 'find-root';
import fs from 'fs';

import { MARVINRC } from '../../const';

type TypeGetPath = () => string;

// $FlowFixMe
export const getPath : TypeGetPath = () => {
  return isInstalledGlobally ? path.resolve(process.env.HOME, MARVINRC) : path.resolve(findRoot(process.cwd()), MARVINRC);
}

type TypeGetPathRootConfig = () => string;

// $FlowFixMe
export const getPathRootConfig : TypeGetPathRootConfig = () => findRoot(isInstalledGlobally ? process.env.HOME : process.cwd(), function (dir) {
  return fs.existsSync(path.resolve(dir, '.marvin.yml'));
});