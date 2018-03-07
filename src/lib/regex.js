const accented = 'àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ';

export const findAllCommand = /^(\s*?(\$[a-z_0-9]+)(?:\s=\s))?([a-z\s0-9\/\-_=\.\:$<>"]+?)(\n|$)+?/gmi;

export const findAllParamsAndOptions = /([\w@#!$%ˆ&*()\\\/\.\:]+?\"[\w@#!$%ˆ&*()\\\/\.\:\s]+\")|(\"[\w@#!$%ˆ&*()\\\/\.\:\s]+\")|(--\w+\=[\w\/\.\:$]+)|(--\w+\=\"[\w@#!$%ˆ&*()\s\/\\\.\:]+\")|([\w\/\.\:\-$<>]+)/gmi;

export const isCommandWithSubCommand = /{([a-z\n\s0-9\/\-\$=<>_{}"\.\:]*)}/mi;

export const getSubCommand = /{([a-z\n\s0-9\/\-\$<>=_"{}\.\:]*)}/mi;

export const replaceSubCommand = /{[a-z\n\s0-9\/\-\$=<>_"{}\.\:]*}/gmi;

export const getNameWithSubCommand = /(?:\s+?(\$[a-z_0-9]+)(?:\s=\s))?([a-z\s0-9\/\-]*)/gmi;
 
export const findVariables = /(\$[a-z_0-9]+)(?:\s=\s)/mi;

export const getVariables = /(\$[a-z_0-9]+)(?:\s=\s)/mi;

export const replaceVariables = /^\$[a-z_0-9]+\s=\s/gmi;

export const isVariable = /(\$[a-z_0-9]+)/mi;

export const isText = /^\"([\w@#!$%ˆ&*()\\\/\.\:\s]+)\"$/mi;

export const isBoolean = /^(true)|(false)$/mi;

export const isNumber = /^[0-9]+$/mi; 
