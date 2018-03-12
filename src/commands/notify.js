import notifier from 'node-notifier';

export default async function (opts, ...args) {
  return new Promise(resolve => {
    notifier.notify({
      title: 'worlflow',
      message: args.join(''),
      wait: false,
      reply: opts.input || false,
    }, (err, response, metadata) => {
      resolve(metadata.activationValue);  
    });
  });
};