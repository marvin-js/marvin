// @flow
import findRoot from 'find-root';
import path from 'path';

const PROJECT_ROOT = findRoot(process.cwd());
const PROJECT_ROOT_MODULES_LOCAL = path.resolve(PROJECT_ROOT, 'node_modules');

const mountNamePlugin = (command: string) => `marvin-${command}`;

const requirePlugin = (command: string, isLocal: boolean = false) => {
  return isLocal ? require(path.resolve(PROJECT_ROOT_MODULES_LOCAL, mountNamePlugin(command))) : require('requireg')(mountNamePlugin(command));
};

export const checkPluginExternalExist = (command: string, isLocal: boolean = false) => {
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

export const loadPluginExternal = (command: string, isLocal: boolean = false) => {
  try {
    return requirePlugin(command, isLocal);
  } catch (e) {
    return !isLocal ? loadPluginExternal(command, true) : false;
  }
};