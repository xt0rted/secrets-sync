import { jest } from "@jest/globals";

import nock from "nock";

import type { DeleteSecretOptions } from "../src/github";

jest.unstable_mockModule("@actions/core", () => ({
  __esModule: true,
  ...(jest.requireActual("@actions/core") as object),
  warning: jest.fn(),
}));

describe("github", () => {
  beforeEach(() => {
    process.env["INPUT_REPO_TOKEN"] = "token";
  });

  afterEach(() => {
    delete process.env["INPUT_REPO_TOKEN"];
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

      const { warning } = await import("@actions/core");
      const { deleteSecret } = await import("../src/github");

      await deleteSecret(deleteOptions);

      expect(scoped.isDone()).toBe(true);
      expect(warning).not.toHaveBeenCalled();
    });

    it("silently skips a secret that doesn't exist", async () => {
      const scoped = nock("https://api.github.com")
        .delete("/repos/xt0rted/test/actions/secrets/APP_ID")
        .reply(404);

      const { warning } = await import("@actions/core");
      const { deleteSecret } = await import("../src/github");

      await deleteSecret(deleteOptions);

      expect(scoped.isDone()).toBe(true);
      expect(warning).toHaveBeenCalledWith("Secret APP_ID for actions does not exist in xt0rted/test");
    });

    it("throws an error when there's an unhandled status", async () => {
      const scoped = nock("https://api.github.com")
        .delete("/repos/xt0rted/test/actions/secrets/APP_ID")
        .reply(403, "Forbidden");

      const { deleteSecret } = await import("../src/github");

      await expect(deleteSecret(deleteOptions)).rejects.toThrow("Error deleting actions secret APP_ID in xt0rted/test; 403 Forbidden");

      expect(scoped.isDone()).toBe(true);
    });
  });
});
