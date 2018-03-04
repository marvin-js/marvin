import inquirer from 'inquirer';

export default async function (opts, message) {
  const answer = await inquirer.prompt([{
    type: 'input',
    name: 'input',
    message,
  }]);

  return answer.input;
};