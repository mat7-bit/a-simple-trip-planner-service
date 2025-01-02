module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/model/$1',
    '^@models$': '<rootDir>/src/model/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@tools/(.*)$': '<rootDir>/src/tools/$1',
  },
}
