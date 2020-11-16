const {defaults} = require('jest-config');

module.exports = {
  preset: 'jest-puppeteer',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  testRegex: '(/__tests__/.*(test|spec))\\.[jt]sx?$',
  // collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
  transform: { '\\.[jt]sx?$': ['babel-jest', {configFile: "./__tests__/.babelrc.json"}] },
};
