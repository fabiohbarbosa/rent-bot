const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/(src|config)/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper
};
