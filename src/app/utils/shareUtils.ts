import CryptoJS from 'crypto-js';

const secretKey = 'secret-key'; //envmaterial

/**
 * Encrypts a string and encodes it for use in a URL.
 * @param toEncrypt The string to encrypt.
 * @returns The encrypted and URL-encoded string.
 */
export const encryptURL = (toEncrypt: string): string => {
  const encryptedText = CryptoJS.AES.encrypt(toEncrypt, secretKey).toString();
  const encodedText = encodeURIComponent(encryptedText);
  return encodedText;
};

/**
 * Decrypts a URL-encoded and AES-encrypted string.
 * @param toDecrypt The URL-encoded and encrypted string.
 * @returns The decrypted string, or null if decryption fails.
 */
export const decryptURL = (toDecrypt: string): string | null => {
  try {
    const decodedText = decodeURIComponent(toDecrypt);
    const bytes = CryptoJS.AES.decrypt(decodedText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedText;
  } catch (error) {
    console.error('Error decrypting URL:', error);
    return null;
  }
};

export default { encryptURL, decryptURL };
