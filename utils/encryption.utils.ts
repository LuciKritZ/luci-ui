import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'default-key-at-least-32-chars-long!!';

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export function decrypt(encryptedText: string, ivHex: string) {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(encryptedText.slice(-32), 'hex');
  const encrypted = encryptedText.slice(0, -32);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encrypts a string using AES-256-GCM.
 * Returns the encrypted text and the initialization vector (IV).
 */
export function encrypt(text: string) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedText: encrypted + authTag,
    iv: iv.toString('hex'),
  };
}

/**
 * Validates the encryption key length
 */
function getEncryptionKey() {
  const key = Buffer.from(ENCRYPTION_KEY);
  if (key.length !== 32) {
    throw new Error(
      `Invalid ENCRYPTION_KEY length: expected 32 bytes, got ${key.length} bytes.`
    );
  }
  return key;
}
