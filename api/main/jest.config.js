module.exports = {
  testEnvironment: 'node',
  rootDir: 'src',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
    '^middleware/(.*)$': '<rootDir>/functions/middleware/$1',
    '^datastore/(.*)$': '<rootDir>/datastore/$1',
    '^util/(.*)$': '<rootDir>/util/$1',
  },
};
