import { processCommandFile } from './analysis';
import { generateCommand } from './exec';

export async function runFile (fileToExecute, libExternal) {
  const actions = await processCommandFile(fileToExecute);
  let store = {};
  const execute = generateCommand(actions, {
    libExternal,
    store: {
      setStore: (name, value) => {
        store[name] = value;
      },
      getStore: (name) => store[name],
    },
  });
  return execute();
};