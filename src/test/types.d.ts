// Type declarations for test environment

// Declare Node.js util module for test setup
declare module 'util' {
  export class TextEncoder {
    encode(input?: string): Uint8Array
  }
  export class TextDecoder {
    decode(input?: Uint8Array): string
  }
}
