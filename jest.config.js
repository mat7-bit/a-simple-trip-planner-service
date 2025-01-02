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
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@data$': '<rootDir>/src/data/$1',
    '^@models/(.*)$': '<rootDir>/src/model/$1',
    '^@models$': '<rootDir>/src/model/$1',
    '^@plugins/(.*)$': '<rootDir>/src/plugins/$1',
    '^@plugins$': '<rootDir>/src/plugins/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@tools/(.*)$': '<rootDir>/src/tools/$1',
  },
}
