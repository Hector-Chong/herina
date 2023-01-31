import { createHash } from "crypto";

export const md5 = (str: string) => createHash("md5").update(str).digest("hex");

export const generateRandomStr = (length: number) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = chars.length;

  let result = "";
  let i = length;

  while (i--) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
};
