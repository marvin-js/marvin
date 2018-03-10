const command = '(\\S+)'
const params = command;
const paramsAsString = '(\\"[^"]+\\"|\'[^\']+\')';
const option = '--\\w+\\=';
const optionWithParams = `(${option}${params})`;
const optionWithParamsAsString = `(${option}${paramsAsString})`;
const allOptions = `${optionWithParams}|${optionWithParamsAsString}`;
const variable = `\\$\\w+`;
const setVariable = `\\s=\\s`;

export const findAllCommand = new RegExp(`^(\s*?(${variable})(?:${setVariable}))?(.+?)(\n|$)+?`, 'gmi');
export const findAllParamsAndOptions = new RegExp(`(\\S+?${paramsAsString})|${paramsAsString}|${allOptions}|${params}`, 'gmi');
export const isCommandWithSubCommand = /{([\s\S]*)}/mi;
export const getSubCommand = /{([\s\S]*)}/mi;
export const replaceSubCommand = /{([\s\S]*)}/mi;
export const getNameWithSubCommand = new RegExp(`(?:\\s+?${variable}${setVariable})?${params}`, 'gmi');
export const findVariables = new RegExp(`(${variable})(?:${setVariable})`, 'mi');
export const getVariables = new RegExp(`(${variable})(?:${setVariable})`, 'mi');
export const replaceVariables = new RegExp(`^${variable}${setVariable}`, 'gmi')
export const isVariable = new RegExp(variable, 'mi');
export const isText = /^(?:\"([^\"]+)\"|\'([^\']+)\')$/mi;
export const isBoolean = /^(true)|(false)$/mi;
export const isNumber = /^\d+$/mi; 
