import * as core from "@actions/core";
import { jest } from "@jest/globals";

import nock from "nock";

import type { DeleteSecretOptions } from "../src/github";

const warningMock = jest.fn();

jest.unstable_mockModule("@actions/core", () => ({
  debug: jest.fn(),
  getInput: jest.fn().mockImplementation((name, options) => (jest.requireActual("@actions/core") as typeof core).getInput(name as string, options as core.InputOptions)),
  info: jest.fn(),
  warning: warningMock,
}));

describe("github", () => {
  beforeEach(() => {
    process.env["INPUT_REPO_TOKEN"] = "token";
  });

  afterEach(() => {
    delete process.env["INPUT_REPO_TOKEN"];

    jest.resetAllMocks();
  });

  describe("deleteSecret", () => {
    const deleteOptions: DeleteSecretOptions = {
      environment: "actions",
      owner: "xt0rted",
      repo: "test",
      secret: "APP_ID",
    };

    it("deletes a secret that exists", async () => {
      const scoped = nock("https://api.github.com")
        .delete("/repos/xt0rted/test/actions/secrets/APP_ID")
        .reply(204);

      const { deleteSecret } = await import("../src/github");

      await deleteSecret(deleteOptions);

      expect(scoped.isDone()).toBe(true);
      expect(warningMock).not.toHaveBeenCalled();
    });

    it("silently skips a secret that doesn't exist", async () => {
      const scoped = nock("https://api.github.com")
        .delete("/repos/xt0rted/test/actions/secrets/APP_ID")
        .reply(404);

      const { deleteSecret } = await import("../src/github");

      await deleteSecret(deleteOptions);

      expect(scoped.isDone()).toBe(true);
      expect(warningMock).toHaveBeenCalledWith("Secret APP_ID for actions does not exist in xt0rted/test");
    });

    it("throws an error when there's an unhandled status", async () => {
      const scoped = nock("https://api.github.com")
        .delete("/repos/xt0rted/test/actions/secrets/APP_ID")
        .reply(403, "Forbidden");

      const { deleteSecret } = await import("../src/github");

      await expect(deleteSecret(deleteOptions)).rejects.toThrowError("Error deleting actions secret APP_ID in xt0rted/test; 403 Forbidden");

      expect(scoped.isDone()).toBe(true);
    });
  });
});
