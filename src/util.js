export function randomString(len, chars) {
  let str = "";
  chars = chars || "0123456789abcdef";
  for (let i=0; i<len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};
