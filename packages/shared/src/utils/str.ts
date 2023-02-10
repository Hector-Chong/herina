import CryptoJS from "crypto-js";

export const md5 = (str: string) => CryptoJS.MD5(str).toString();

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
