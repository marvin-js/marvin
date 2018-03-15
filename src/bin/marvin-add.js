#!/usr/bin/env node

import program from 'commander';
import idx from 'idx';

import { load, save } from '../lib/configYML';

program
  .usage('<name> <path>')
  .option('--local', 'packet is local');

program.parse(process.argv);

const name = idx(program, _ => _.args[0]);
const pathPacket = idx(program, _ => _.args[1]);

if (name && path) {

  const config = load();

  if (!config.packet) config.packet = [];

  config.packet.push({
    name,
    path: pathPacket,
    isLocal: program.isLocal,
  });

  save(config);
}
