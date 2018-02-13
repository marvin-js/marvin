export function pure (commands = []) {
  if (commands === null) return [];

  return commands.map(command => typeof command === 'string' ? command.trim() : command).filter(command => command !== '');
};