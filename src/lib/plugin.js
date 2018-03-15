// @flow
import findRoot from 'find-root';
import path from 'path';
import { loader } from './loader';

const PROJECT_ROOT = findRoot(process.cwd());
const PROJECT_ROOT_MODULES_LOCAL = path.resolve(PROJECT_ROOT, 'node_modules');

type TypeMountNamePlugin = string => string;

const mountNamePlugin : TypeMountNamePlugin = command => `marvin-${command}`;

const requirePlugin = (command: string, isLocal: boolean = false) => loader({
  pathModule: PROJECT_ROOT_MODULES_LOCAL,
  name: mountNamePlugin(command),
  isLocal,
});

type TypeCheckPluginExternalExist = (string, isLocal? : boolean) => boolean;

export const checkPluginExternalExist : TypeCheckPluginExternalExist = (command, isLocal = false) => {
  try {
    const pluginExternal = requirePlugin(command, isLocal);

    if (pluginExternal && typeof pluginExternal === 'function') {
      return true;
    }

    return false;
  } catch (e) {
    return !isLocal ? checkPluginExternalExist(command, true) : false;
  }
};

type TypeLoadPluginExternal = (command : string, isLocal? : boolean) => (Function | boolean);

export const loadPluginExternal : TypeLoadPluginExternal = (command, isLocal = false) => {
  try {
    return requirePlugin(command, isLocal);
  } catch (e) {
    return !isLocal ? loadPluginExternal(command, true) : false;
  }
};