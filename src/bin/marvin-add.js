#!/usr/bin/env node

import isInstalledGlobally from 'is-installed-globally';
import YAML from 'yamljs';
import program from 'commander';
import idx from 'idx';
import path from 'path';
import fs from 'fs';
import findRoot from 'find-root';

program
  .usage('<name> <path>')

program.parse(process.argv);

const PATHRC = isInstalledGlobally ? path.resolve(process.env.HOME, '.marvin.yml') : path.resolve(findRoot(process.cwd()), '.marvin.yml');
const name = idx(program, _ => _.args[0]);
const pathPacket = idx(program, _ => _.args[1]);

if (name && path) {

  let config = YAML.load(PATHRC);

  if (config === null) config = {};

  if (!config.packet) config.packet = [];

  config.packet.push({
    name,
    path: pathPacket,
  });


  fs.writeFileSync(PATHRC, YAML.stringify(config), 'utf8');
}
