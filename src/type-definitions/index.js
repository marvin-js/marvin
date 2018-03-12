// @flow

export type TypeAction = {
  command: string,
  commands: Array<TypeAction>,
  line: number,
  nextLine: number,
  options: {
    [string]: string | number | Object | boolean,
  },
  args: Array<string | number | Object | boolean | Array<*>>,
};

type OptionsCommand = {
  [string]: string | number | boolean,
};

export type TypeLibExternal = {
  [string]: (OptionsCommand, ...args: Array<string | number | boolean>) => any,
};

type OptionsLibExternal = {
  [key: string]: string | Array<*> | boolean | number,
};

type ArgsLibExternal = string | Object | boolean | number | Array<*>;

type LibExternalWithExecute = (?any) => Promise<*>;

type FunctionLibExternal = (OptionsLibExternal, ...ArgsLibExternal) => LibExternalWithExecute;

export type OptionsExec = {
  store: Object,
  libExternal: {
    [key: string]: FunctionLibExternal,
  },
};