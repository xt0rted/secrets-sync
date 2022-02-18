import { fileURLToPath } from "node:url";

import {
  loadConfig,
  readConfigValue,
} from "../src/config";

describe("config", () => {
  describe("loadConfig", () => {
    it("should return a config", async () => {
      const configFile = fileURLToPath(new URL("test-config.yml", import.meta.url));

      await expect(loadConfig(configFile)).resolves.toMatchSnapshot();
    });
  });

  describe("readConfigValue", () => {
    afterEach(() => {
      delete process.env["INPUT_VALUE"];
    });

    it("should return undefined if undefined is provided", () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(readConfigValue(undefined)).toBeUndefined();
    });

    it("should return null if null is provided", () => {
      // eslint-disable-next-line unicorn/no-null
      expect(readConfigValue(null!)).toBeNull();
    });

    it("should return the value if it's not an env variable", () => {
      expect(readConfigValue("TEST_VALUE")).toBe("TEST_VALUE");
    });

    it("should return the value if it's an env variable", () => {
      process.env["TEST_VALUE"] = "test";

      expect(readConfigValue("env/TEST_VALUE")).toBe("test");
    });
  });
});
