/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  globals: { "ts-jest": { useESM: true } },
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  preset: "ts-jest/presets/default-esm",
  resetMocks: true,
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  testRunner: "jest-circus/runner",
};

const processStdoutWrite = process.stdout.write.bind(process.stdout);

process.stdout.write = (string_, encoding, callback) => {
  if (!string_?.startsWith("::")) {
    return processStdoutWrite(string_, encoding, callback);
  }
};
