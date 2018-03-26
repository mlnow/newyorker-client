// @flow

/**
 * Returns a random string of length `len`, sampling with replacement from `chars`.
 */
export function randomString(len: number, chars: string = "0123456789abcdef"): string {
  let str = "";
  chars = chars;
  for (let i=0; i<len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};
