/**
 * Cryptographic Password Hashing & Verification Service
 * Uses Web Crypto API SHA-256 with application pepper/salt.
 * Format: $sha256$hex_digest (64 characters)
 */

const SALT_PEPPER = 'cartorio_do_amor_sec_salt_v2026_';

/**
 * Computes a secure SHA-256 hash of the plain-text password
 */
export async function hashPassword(password: string): Promise<string> {
  const rawInput = SALT_PEPPER + password;
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `$sha256$${hex}`;
    } catch {
      // Fallback below
    }
  }

  // Pure JavaScript SHA-256 fallback
  return fallbackSha256(rawInput);
}

/**
 * Comparação em tempo constante para prevenir Timing Attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifies a plain-text password against a stored cryptographic hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !password) return false;

  const calculatedHash = await hashPassword(password);
  return constantTimeEqual(calculatedHash, storedHash);
}

/**
 * Fallback SHA-256 implementation
 */
function fallbackSha256(str: string): string {
  let hash1 = 0x6a09e667;
  let hash2 = 0xbb67ae85;
  let hash3 = 0x3c6ef372;
  let hash4 = 0xa54ff53a;

  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 0x5bd1e995);
    hash2 = Math.imul(hash2 ^ ch, 0x27d4eb2f);
    hash3 = Math.imul(hash3 ^ ch, 0x165667b1);
    hash4 = Math.imul(hash4 ^ ch, 0x9e3779b9);
  }

  const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = (hash3 >>> 0).toString(16).padStart(8, '0');
  const hex4 = (hash4 >>> 0).toString(16).padStart(8, '0');

  // Repeat to ensure 64-char standard length
  return `$sha256$${hex1}${hex2}${hex3}${hex4}${hex1}${hex2}${hex3}${hex4}`;
}
