module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/examples.spec.ts', '<rootDir>/tests/'], // Ignore Playwright tests
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"], // Include all files
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json", "html"]
};
