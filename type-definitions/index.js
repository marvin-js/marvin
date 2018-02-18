// @flow

export type Action = {
  command: string,
  commands: Array<Action>,
  options: Array<{
    [string]: string | number | Object | boolean,
  }>,
  args: Array<string | number | Object | boolean | Array<*>>,
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