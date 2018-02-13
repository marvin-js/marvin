export function pure (commands = []) {
  if (commands === null) return [];

  return commands.map(command => command.trim()).filter(command => command !== '');
};