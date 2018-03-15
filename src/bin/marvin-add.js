#!/usr/bin/env node

import program from 'commander';
import idx from 'idx';

import { load, save } from '../lib/configYML';

program
  .usage('<type> <name> <path> [options]')
  .option('--local', 'packet is local');

program.parse(process.argv);

const type = idx(program, _ => _.args[0]);
const name = idx(program, _ => _.args[1]);
const pathPacket = idx(program, _ => _.args[2]);

if (type !== 'packet') {
  console.log(`Don't exist this type: ${type}`);
  process.exit(1);
}

if (name && pathPacket) {

  const config = load();

  if (!config.packet) config.packet = [];

  config.packet.push({
    name,
    path: pathPacket,
    isLocal: program.local,
  });

  save(config);
}
