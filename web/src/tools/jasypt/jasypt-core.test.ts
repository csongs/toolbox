import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, ALGORITHMS } from './jasypt-core'

describe('jasypt-core', () => {
  const testPassword = 'testPassword123'
  const testText = 'Hello World'

  describe('ALGORITHMS', () => {
    it('should have 5 algorithm definitions', () => {
      expect(ALGORITHMS).toHaveLength(5)
    })

    it('should have PBEWITHHMACSHA512ANDAES_256 as first entry', () => {
      expect(ALGORITHMS[0].id).toBe('PBEWITHHMACSHA512ANDAES_256')
    })
  })

  describe('encrypt', () => {
    it('should return error for empty password', async () => {
      const result = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: '', text: testText })
      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should return error for empty text', async () => {
      const result = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: '' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should return error for unknown algorithm', async () => {
      const result = await encrypt({ algorithm: 'UNKNOWN', password: testPassword, text: testText })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unknown')
    })

    it('should produce ENC() wrapped output', async () => {
      const result = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(result.success).toBe(true)
      expect(result.result).toMatch(/^ENC\(.+\)$/)
    })
  })

  describe('encrypt + decrypt round trip', () => {
    it('should round-trip with PBEWITHHMACSHA512ANDAES_256', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHHMACSHA256ANDAES_256', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA256ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA256ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHHMACSHA512ANDAES_128', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_128', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_128', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHHMACSHA1ANDAES_128', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA1ANDAES_128', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA1ANDAES_128', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHMD5ANDDES (approximate)', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHMD5ANDDES', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHMD5ANDDES', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip Chinese text', async () => {
      const text = '加密測試中文內容'
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(text)
    })

    it('should produce different ciphertexts for same input', async () => {
      // Due to random salt+IV, two encryptions of same input should differ
      const enc1 = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      const enc2 = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc1.result).not.toBe(enc2.result)
    })

    it('should fail decryption with wrong password', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: 'wrongPassword', encryptedText: enc.result! })
      expect(dec.success).toBe(false)
    })

    it('should handle ENC() wrapper in decrypt input', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)

      // Decrypt with the ENC() wrapped version
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should handle custom iterations', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText, iterations: 5000 })
      expect(enc.success).toBe(true)

      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result!, iterations: 5000 })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })
  })

  describe('decrypt edge cases', () => {
    it('should fail for empty encrypted text', async () => {
      const result = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: '' })
      expect(result.success).toBe(false)
    })
  })
})
