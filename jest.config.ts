module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/examples.spec.ts', '<rootDir>/tests/'], // Ignore Playwright tests
};
