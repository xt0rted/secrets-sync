import { fileURLToPath } from "node:url";

import {
  loadConfig,
  readConfigValue,
} from "../src/config";

describe("config", () => {
  describe("loadConfig", () => {
    test("should return a config", async () => {
      const configFile = fileURLToPath(new URL("test-config.yml", import.meta.url));

      expect(await loadConfig(configFile)).toMatchSnapshot();
    });
  });

  describe("readConfigValue", () => {
    afterEach(() => {
      delete process.env["INPUT_VALUE"];
    });

    test("should return undefined if undefined is provided", () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(readConfigValue(undefined)).toBe(undefined);
    });

    test("should return null if null is provided", () => {
      // eslint-disable-next-line unicorn/no-null
      expect(readConfigValue(null!)).toBe(null);
    });

    test("should return the value if it's not an env variable", () => {
      expect(readConfigValue("TEST_VALUE")).toEqual("TEST_VALUE");
    });

    test("should return the value if it's an env variable", () => {
      process.env["TEST_VALUE"] = "test";

      expect(readConfigValue("env/TEST_VALUE")).toEqual("test");
    });
  });
});
