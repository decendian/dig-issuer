const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  // Fix coverage paths to match your actual structure
  collectCoverageFrom: [
    'src/app/**/*.{js,jsx,ts,tsx}',  // Update this path
    'src/components/**/*.{js,jsx,ts,tsx}',  // Add this for components
    '!src/**/*.d.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/**/error.tsx',
  ],
  // Add this to see which files are being tested
  verbose: true,
}

module.exports = createJestConfig(customJestConfig)