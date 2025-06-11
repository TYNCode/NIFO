import CryptoJS from "crypto-js";
const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET

/**
 * AES encrypts a string and URL-encodes it.
 */
export const encryptURL = (toEncrypt: string): string => {
  try {
    if (!toEncrypt || (typeof toEncrypt !== "string" && typeof toEncrypt !== "number")) {
      console.warn("[ENCRYPT_URL] Invalid input (not string/number):", toEncrypt);
      throw new Error("Input must be a valid string or number");
    }

    const cleanInput = String(toEncrypt).trim();
    if (!cleanInput) throw new Error("Input cannot be empty");

    const encryptedText = CryptoJS.AES.encrypt(cleanInput, secretKey).toString();
    const encodedText = encodeURIComponent(encryptedText);

    return encodedText;
  } catch (error) {
    console.error("[ENCRYPT_URL] Error:", error);
    throw new Error("Encryption failed");
  }
};

/**
 * URL-decodes and AES decrypts a string.
 */
export const decryptURL = (toDecrypt: string): string | null => {
  try {
    if (!toDecrypt || typeof toDecrypt !== "string") {
      console.error("[DECRYPT_URL] Invalid input type:", toDecrypt);
      return null;
    }

    const trimmedInput = toDecrypt.trim();
    console.log("[DECRYPT_URL] Trimmed input:", trimmedInput);

    const decodedText = decodeURIComponent(trimmedInput);
    console.log("[DECRYPT_URL] URL Decoded:", decodedText);

    const bytes = CryptoJS.AES.decrypt(decodedText, secretKey);
    console.log("[DECRYPT_URL] AES Bytes:", bytes);

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("[DECRYPT_URL] Final Decrypted Text:", decryptedText);

    if (!decryptedText) {
      console.warn("[DECRYPT_URL] Decryption failed - possibly invalid key or corrupted input. Key used:", secretKey);
      return null;
    }

    return decryptedText;
  } catch (error) {
    console.error("[DECRYPT_URL] Error:", error);
    return null;
  }
};

/**
 * AES encrypts a string and returns a URL-safe base64 version.
 */
export const encryptURLBase64 = (toEncrypt: string): string => {
  try {
    console.log("[ENCRYPT_B64] Input:", toEncrypt);

    const cleanInput = String(toEncrypt).trim();
    if (!cleanInput) throw new Error("Input cannot be empty");

    const encrypted = CryptoJS.AES.encrypt(cleanInput, secretKey).toString();
    console.log("[ENCRYPT_B64] AES Encrypted:", encrypted);

    const base64 = btoa(encrypted);
    console.log("[ENCRYPT_B64] Base64:", base64);

    const urlSafe = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    console.log("[ENCRYPT_B64] URL-Safe Base64:", urlSafe);

    return urlSafe;
  } catch (error) {
    console.error("[ENCRYPT_B64] Error:", error);
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

/**
 * Decrypts a URL-safe base64 AES encrypted string.
 */
export const decryptURLBase64 = (toDecrypt: string): string | null => {
  try {
    console.log("[DECRYPT_B64] Input:", toDecrypt);

    if (!toDecrypt || typeof toDecrypt !== "string") {
      console.warn("[DECRYPT_B64] Invalid input");
      return null;
    }

    let base64 = toDecrypt.replace(/-/g, "+").replace(/_/g, "/");
    console.log("[DECRYPT_B64] Base64 (before padding):", base64);

    while (base64.length % 4 !== 0) base64 += "=";
    console.log("[DECRYPT_B64] Base64 (after padding):", base64);

    const encryptedText = atob(base64);
    console.log("[DECRYPT_B64] Decoded AES:", encryptedText);

    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    console.log("[DECRYPT_B64] AES Bytes:", bytes);

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("[DECRYPT_B64] Final Decrypted Text:", decryptedText);

    return decryptedText || null;
  } catch (error) {
    console.error("[DECRYPT_B64] Error:", error);
    return null;
  }
};

// ✅ Optional test when used in dev/debug context
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const testId = "1";
  const encrypted = encryptURL(testId);
  const decrypted = decryptURL(encrypted);

  console.log("[TEST] Encrypted:", encrypted);
  console.log("[TEST] Decrypted:", decrypted);
}

export default {
  encryptURL,
  decryptURL,
  encryptURLBase64,
  decryptURLBase64,
};
