import chokidar from 'chokidar';

export default function (opts, path) {
  return execute => {
    chokidar.watch(path).on('all', (event, path) => {
      execute(path);
    });
  };
}