import chalk from 'chalk';

export default () => {
  console.log();
  console.log();
  console.log('  How use the Marvin, step-by-step:');
  console.log();
  console.log();
  console.log(`    ${chalk.bgRed(' 1. ')}: Create um file with name .marvin and these content below`);
  console.log();
  console.log('          $content = watch ./src/file --async {');
  console.log('            log file changed');
  console.log('          }');
  console.log();
  console.log();
  console.log(`    ${chalk.bgRed(' 2. ')}: Run the file`);
  console.log();
  console.log('          marvin');
  console.log();
  console.log();
  console.log();
};