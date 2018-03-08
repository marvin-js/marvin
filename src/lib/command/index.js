import { processCommandFile } from './analysis';
import { generateCommand } from './exec';
import log from '../log';
import chalk from 'chalk';

const processUnique = async (fileToExecute, libExternal) => {
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

export async function runFile (fileToExecute, libExternal) {

  if (typeof fileToExecute === 'string') return processUnique(fileToExecute, libExternal);

  let promise = Promise.resolve();

  fileToExecute.forEach(file => {
    promise = promise.then(() => processUnique(file, libExternal));
  });

  return promise;
};