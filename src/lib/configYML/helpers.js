// @flow

import isInstalledGlobally from 'is-installed-globally';
import path from 'path';
import findRoot from 'find-root';

import { MARVINRC } from '../../const';

type TypeGetPath = () => string;

// $FlowFixMe;
export const getPath : TypeGetPath = () => isInstalledGlobally ? path.resolve(process.env.HOME, MARVINRC) : path.resolve(findRoot(process.cwd()), MARVINRC);