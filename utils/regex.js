export const findAllCommand = /^(\s*?(\$[a-z_0-9]+)(?:\s=\s))?([a-z\s0-9\/\-_=]+?)(\n|$)+?/gmi;

export const isCommandWithSubCommand = /{([a-z\n\s0-9\/\-\$=_{}]*)}/mi;

export const getSubCommand = /{([a-z\n\s0-9\/\-\$=_{}]*)}/mi;

export const replaceSubCommand = /{[a-z\n\s0-9\/\-\$=_{}]*}/gmi;

export const getNameWithSubCommand = /(?:\s+?(\$[a-z_0-9]+)(?:\s=\s))?([a-z\s0-9\/\-]*)/gmi;
 
export const findVariables = /(\$[a-z_0-9]+)(?:\s=\s)/mi;

export const getVariables = /(\$[a-z_0-9]+)(?:\s=\s)/mi;

export const replaceVariables = /^\$[a-z_0-9]+\s=\s/gmi;