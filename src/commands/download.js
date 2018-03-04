import download from 'download';

export default function (opts, url, path) {
  return download(url, path)
};