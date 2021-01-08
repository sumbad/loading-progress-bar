const path = require('path');
const { defaults } = require('jest-config');

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'ts', 'tsx'],
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testRegex: '(/__tests__/.*(test|spec))\\.[jt]sx?$',
  transform: { '\\.[jt]sx?$': ['babel-jest', { configFile: path.join(__dirname, '__tests__/.babelrc.json') }] },
  transformIgnorePatterns: ['../../node_modules/(?!${@web-companions/fc})'],
  collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}', '!<rootDir>/node_modules/'],
  coverageDirectory: 'coverage',
  // coverageThreshold: {
  //   global: {
  //     lines: 90,
  //     statements: 90,
  //   },
  // },
  verbose: false,
  collectCoverage: true,
  // moduleFileExtensions: [
  //   'ts',
  //   'tsx',
  //   'js',
  //   'jsx',
  //   'json',
  //   'node'
  // ]
  // coverageReporters: ['json'],
};
