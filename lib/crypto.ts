// import { hash } from 'phc-argon2';
import argon2 from 'argon2-browser/dist/argon2-bundled.min.js';

const AUTH_HASH_PARAMS = {
    timeCost: 1,
    memoryCost: 64 * 1024,
    parallelism: 4
};

const ENCRYPTION_KEY_PARAMS = {
    time: 2,
    mem: 128 * 1024,
    hashLen: 32,
    parallelism: 4
};

/**
 * This function generates a cryptographically secure random salt.
 *
 * @returns {Uint8Array} A 16-byte random salt.
 */
const generateSalt = (): Uint8Array => {
    return window.crypto.getRandomValues(new Uint8Array(16));
};

/**
 * This function derives an authentication hash from a master password.
 *
 * @param {string} password - The user's master password.
 * @param {Uint8Array} salt - The salt to use for hashing.
 * @returns {Promise<string>} The derived auth hash, encoded as a hex string.
 */
const deriveAuthHash = async (
    password: string,
    salt: Uint8Array
): Promise<string> => {
    const hashResult = await argon2.hash({
        ...AUTH_HASH_PARAMS,
        pass: password,
        salt: salt
    });

    // Return the raw hash, not the full encoded string. The server will store
    // this after its own hashing.
    return hashResult.hashHex;
};

/**
 * This function derives an encryption key from a master password.
 *
 * @param {string} password - The user's master password.
 * @param {Uint8Array} salt - The salt to use for key derivation.
 * @returns {Promise<Uint8Array>} The 32-byte derived encryption key.
 */
const deriveEncryptionKey = async (
    password: string,
    salt: Uint8Array
): Promise<Uint8Array> => {
    const hashResult = await argon2.hash({
        ...ENCRYPTION_KEY_PARAMS,
        pass: password,
        salt: salt
    });

    // We return the raw hash bytes to be used as the encryption key.
    return hashResult.hash;
};

/**
 * Encrypts a string and returns a Base64 string suitable for the Go Backend
 */
async function encryptAndEncode(
    plainText: string,
    key: CryptoKey
): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    // 1. Generate a random Initialization Vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 2. Encrypt using AES-GCM
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    // 3. Combine IV + Encrypted Data (Standard practice to prepend IV)
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // 4. Convert binary to Base64 for JSON transport
    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a Base64 string from the Go API back to plain text
 */
async function decodeAndDecrypt(
    base64Data: string,
    key: CryptoKey
): Promise<string> {
    // 1. Convert Base64 string back to binary (Uint8Array)
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Extract the IV (first 12 bytes) and the actual ciphertext
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);

    // 3. Decrypt using the same algorithm (AES-GCM)
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
    );

    // 4. Convert the decoded buffer back to a UTF-8 string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}

export const cryptoService = {
    generateSalt,
    deriveAuthHash,
    deriveEncryptionKey,
    encryptAndEncode,
    decodeAndDecrypt
};
