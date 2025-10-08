// src/utils/cryptoUtils.ts
//import CryptoJS from "crypto-js";
import CryptoJS from 'crypto-js';

export const deriveKey = (password: string, salt: string) => {
  return CryptoJS.SHA256(password + salt).toString(); // hex string
};


export const encryptAES = (plain: string, keyHex: string) => {
 
  return CryptoJS.AES.encrypt(plain, keyHex).toString();
};


export const decryptAES = (cipher: string, keyHex: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, keyHex);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
