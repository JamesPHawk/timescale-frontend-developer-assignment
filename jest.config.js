/** @type {import('jest').Config} */
const config = {
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    "^@ark-ui/react/format$": "<rootDir>/node_modules/@ark-ui/react",
  },
};

module.exports = config;