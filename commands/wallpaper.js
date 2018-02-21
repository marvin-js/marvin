import wallpaper from 'wallpaper';

export default function (opts, path) {
  if (path) {
    return wallpaper.set(path);
  }

  return wallpaper.get();
}