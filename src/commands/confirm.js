import inquirer from 'inquirer';

export default async function (opts, message) {
  const answer = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message,
    default: opts.default || false,
  }]);

  return answer.confirm;
};