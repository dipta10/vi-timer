export function secondsToHms(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let ret = '';
  if (hours != 0) ret += ' ' + hours + 'h';
  if (minutes != 0 || hours != 0) ret += ' ' + minutes + 'm';
  ret += ' ' + remainingSeconds + 's';
  return ret;
}
