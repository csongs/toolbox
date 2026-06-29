// Jasypt-compatible encryption/decryption using Web Crypto API

export interface AlgorithmConfig {
  id: string
  name: string
  keySize: number      // 128 or 256 bits
  cipher: 'AES-CBC'
  hashAlgo: 'SHA-1' | 'SHA-256' | 'SHA-512'
  useIV: boolean
  usePBKDF2: boolean
  defaultIvGenerator: string
  defaultKeyAlgo: string
  defaultIterations: number
  defaultSaltSizeBytes: number   // Jasypt salt size, typically 8 or 16
  approximate?: boolean  // true if this is an approximation, not truly Jasypt-compatible
}

export const ALGORITHMS: AlgorithmConfig[] = [
  {
    id: 'PBEWITHHMACSHA512ANDAES_256',
    name: 'PBEWITHHMACSHA512ANDAES_256',
    keySize: 256,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-512',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA512',
    defaultIterations: 1000,
    defaultSaltSizeBytes: 16,
  },
  {
    id: 'PBEWITHHMACSHA256ANDAES_256',
    name: 'PBEWITHHMACSHA256ANDAES_256',
    keySize: 256,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-256',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA256',
    defaultIterations: 1000,
    defaultSaltSizeBytes: 16,
  },
  {
    id: 'PBEWITHHMACSHA512ANDAES_128',
    name: 'PBEWITHHMACSHA512ANDAES_128',
    keySize: 128,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-512',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA512',
    defaultIterations: 1000,
    defaultSaltSizeBytes: 8,
  },
  {
    id: 'PBEWITHHMACSHA1ANDAES_128',
    name: 'PBEWITHHMACSHA1ANDAES_128',
    keySize: 128,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-1',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA1',
    defaultIterations: 1000,
    defaultSaltSizeBytes: 8,
  },
  {
    id: 'PBEWITHMD5ANDDES',
    name: 'PBEWITHMD5ANDDES',
    keySize: 128,        // Approximation: Web Crypto requires 128-bit for AES, real Jasypt uses 64-bit DES
    cipher: 'AES-CBC',   // Approximation: Jasypt maps this to DES/CBC/PKCS5Padding
    hashAlgo: 'SHA-1',
    useIV: false,
    usePBKDF2: false,    // MD5-based key derivation (not PBKDF2)
    defaultIvGenerator: '',
    defaultKeyAlgo: 'MD5',
    defaultIterations: 0,
    defaultSaltSizeBytes: 8,
    approximate: true,
  },
]

export interface EncryptParams {
  algorithm: string
  password: string
  text: string
  keyAlgorithm?: string
  iterations?: number
  saltSize?: number
}

export interface DecryptParams {
  algorithm: string
  password: string
  encryptedText: string
  keyAlgorithm?: string
  iterations?: number
  saltSize?: number
}

export interface CryptoResult {
  success: boolean
  result?: string
  error?: string
}

// ─── Helper functions ─────────────────────────────────────────────────────────

// TypeScript 5.5+ workaround: Uint8Array<ArrayBufferLike> is not directly
// assignable to Web Crypto's BufferSource type. This cast is safe at runtime.
function toCrypto(data: Uint8Array): BufferSource {
  return data as unknown as BufferSource
}

// Encode text to UTF-8 bytes
function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

// Decode UTF-8 bytes to text
function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

// Base64 encode
function bytesToBase64(bytes: Uint8Array): string {
  const binStr = Array.from(bytes).map(b => String.fromCharCode(b)).join('')
  return btoa(binStr)
}

// Base64 decode
function base64ToBytes(base64: string): Uint8Array {
  const binStr = atob(base64.replace(/\s/g, ''))
  return Uint8Array.from(binStr, c => c.charCodeAt(0))
}

// Remove ENC() wrapper if present
function unwrapEnc(text: string): string {
  const match = text.match(/^ENC\((.+)\)$/)
  return match ? match[1] : text
}

// Wrap in ENC()
function wrapEnc(text: string): string {
  return `ENC(${text})`
}

// ─── Key derivation ───────────────────────────────────────────────────────────

function getPbkdf2Hash(algorithm: string): string {
  switch (algorithm) {
    case 'PBKDF2WithHmacSHA1': return 'SHA-1'
    case 'PBKDF2WithHmacSHA256': return 'SHA-256'
    case 'PBKDF2WithHmacSHA512': return 'SHA-512'
    default: return 'SHA-512'
  }
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  keySize: number,
  keyAlgorithm: string,
  iterations: number
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    toCrypto(textToBytes(password)),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toCrypto(salt),
      iterations,
      hash: getPbkdf2Hash(keyAlgorithm),
    },
    keyMaterial,
    { name: 'AES-CBC', length: keySize },
    false,
    ['encrypt', 'decrypt']
  )
}

// APPROXIMATION: Jasypt uses a custom MD5-based key derivation for PBEWithMD5AndDES.
// Web Crypto API does not expose raw MD5 or DES, so we approximate using:
//   - PBKDF2 with SHA-1 and 1 iteration (instead of iterative MD5 hashing)
//   - AES-128-CBC with a 16-byte zero IV   (instead of DES/CBC/NoPadding)
// This produces internally consistent results (encrypt → decrypt) but CANNOT
// interoperate with real Jasypt implementations.
async function deriveKeyMD5(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    toCrypto(passwordBytes),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toCrypto(salt),
      iterations: 1,
      hash: 'SHA-1',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 128 },
    false,
    ['encrypt', 'decrypt']
  )
}

// ─── Encrypt ──────────────────────────────────────────────────────────────────

export async function encrypt(params: EncryptParams): Promise<CryptoResult> {
  try {
    const algo = ALGORITHMS.find(a => a.id === params.algorithm)
    if (!algo) return { success: false, error: `Unknown algorithm: ${params.algorithm}` }
    if (!params.password) return { success: false, error: 'Password is required' }
    if (!params.text) return { success: false, error: 'Text is required' }

    const password = params.password
    const plainBytes = textToBytes(params.text)
    const saltSize = params.saltSize || algo.defaultSaltSizeBytes
    const salt = crypto.getRandomValues(new Uint8Array(saltSize))

    let encrypted: ArrayBuffer

    if (algo.usePBKDF2) {
      const keyAlgo = params.keyAlgorithm || algo.defaultKeyAlgo
      const iterations = params.iterations || algo.defaultIterations
      const key = await deriveKey(password, salt, algo.keySize, keyAlgo, iterations)

      // Generate random IV for AES-CBC
      const iv = crypto.getRandomValues(new Uint8Array(16))

      encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: toCrypto(iv) },
        key,
        toCrypto(plainBytes)
      )

      // Format: Base64(salt || iv || ciphertext)
      const resultBytes = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      resultBytes.set(salt)
      resultBytes.set(iv, salt.length)
      resultBytes.set(new Uint8Array(encrypted), salt.length + iv.length)

      return { success: true, result: wrapEnc(bytesToBase64(resultBytes)) }
    } else {
      // PBEWITHMD5ANDDES — approximation using AES-128-CBC
      const key = await deriveKeyMD5(password, salt)
      const iv = new Uint8Array(16)

      encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: toCrypto(iv) },
        key,
        toCrypto(plainBytes)
      )

      // Format: Base64(salt || ciphertext) — no IV for MD5+DES
      const resultBytes = new Uint8Array(salt.length + encrypted.byteLength)
      resultBytes.set(salt)
      resultBytes.set(new Uint8Array(encrypted), salt.length)

      return { success: true, result: wrapEnc(bytesToBase64(resultBytes)) }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message || '(no message)' : String(err)
    return { success: false, error: message }
  }
}

// ─── Decrypt ──────────────────────────────────────────────────────────────────

export async function decrypt(params: DecryptParams): Promise<CryptoResult> {
  try {
    const algo = ALGORITHMS.find(a => a.id === params.algorithm)
    if (!algo) return { success: false, error: `Unknown algorithm: ${params.algorithm}` }
    if (!params.password) return { success: false, error: 'Password is required' }
    if (!params.encryptedText) return { success: false, error: 'Encrypted text is required' }

    const password = params.password
    const raw = unwrapEnc(params.encryptedText.trim())
    const allBytes = base64ToBytes(raw)
    const saltSize = params.saltSize || algo.defaultSaltSizeBytes

    // Extract salt
    const salt = allBytes.slice(0, saltSize)
    let cipherBytes: Uint8Array
    let iv: Uint8Array

    if (algo.useIV) {
      iv = allBytes.slice(saltSize, saltSize + 16)    // next 16 bytes
      cipherBytes = allBytes.slice(saltSize + 16)
    } else {
      iv = new Uint8Array(16)
      cipherBytes = allBytes.slice(saltSize)
    }

    let key: CryptoKey

    if (algo.usePBKDF2) {
      const keyAlgo = params.keyAlgorithm || algo.defaultKeyAlgo
      const iterations = params.iterations || algo.defaultIterations
      key = await deriveKey(password, salt, algo.keySize, keyAlgo, iterations)
    } else {
      key = await deriveKeyMD5(password, salt)
    }

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: toCrypto(iv) },
      key,
      toCrypto(cipherBytes)
    )

    return { success: true, result: bytesToText(new Uint8Array(decrypted)) }
  } catch (err) {
    const errorName = err instanceof DOMException ? err.name
      : err instanceof Error ? err.constructor.name
      : 'UnknownError'
    const message = err instanceof Error ? err.message || '(no message)' : String(err)
    return { success: false, error: `[${errorName}] ${message}` }
  }
}
