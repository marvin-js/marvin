import { processCommandFile } from './analysis';
import { generateCommand } from './exec';
import log from '../log';
import chalk from 'chalk';

export async function runFile (fileToExecute, libExternal) {
  const actions = await processCommandFile(fileToExecute, libExternal);
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

  console.log('\nExecuting the workflow... \n');
  return execute()
  .then(() => log.draft(`\n${chalk.green('✔')} Workflow finished`));
};