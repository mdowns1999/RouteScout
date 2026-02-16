import type { Config } from 'jest'

const config: Config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Use jsdom environment for React components (simulates browser)
  testEnvironment: 'jsdom',

  // Root directory for tests
  roots: ['<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // Transform TypeScript files with ts-jest
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx', // Match Vite's JSX transform
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          verbatimModuleSyntax: false,
        },
        diagnostics: {
          ignoreCodes: [1484], // Ignore verbatimModuleSyntax type import warnings
        },
      },
    ],
  },

  // Transform ESM packages from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@emotion|@babel/runtime)/)',
  ],

  // Module name mapping for static assets and styles
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/src/test/__mocks__/fileMock.ts',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/__mocks__/fileMock.ts',
  },

  // Setup files to run after test environment is set up
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Verbose output
  verbose: true,
}

export default config
