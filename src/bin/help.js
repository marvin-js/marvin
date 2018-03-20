import chalk from 'chalk';

export default () => console.log(`
  How use the Marvin, step-by-step:

  ${chalk.bgRed(' 1. ')}: Create um file with name .marvin and these content below
    $content = watch ./src/file --async {
      log file changed
    }

  ${chalk.bgRed(' 2. ')}: Run the file

    marvin


`);