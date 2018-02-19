import inquirer from 'inquirer';

export default async function (opts, message, ...args) {
  const answer = await inquirer.prompt([{
    type: 'checkbox',
    name: 'checkbox',
    message,
    choices: args.map(name => ({name})),
  }]);

  return answer.checkbox;
};