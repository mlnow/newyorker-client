// @flow

export function randomString(len: number, chars?: string): string {
  let str = "";
  chars = chars || "0123456789abcdef";
  for (let i=0; i<len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};
