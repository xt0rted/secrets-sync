import {
  ignoreCaseCompare,
  loadFilter,
} from "../src/utils";

describe("utils", () => {
  describe("ignoreCaseCompare", () => {
    // eslint-disable-next-line no-unused-vars
    let ignoreFunction: (right: string) => boolean;

    beforeEach(() => {
      ignoreFunction = ignoreCaseCompare("foo");
    });

    it("returns false for different values", () => {
      expect(ignoreFunction("bar")).toBe(false);
    });

    it("returns true for the same value", () => {
      expect(ignoreFunction("foo")).toBe(true);
    });

    it("returns true for the same value of different casing", () => {
      expect(ignoreFunction("FOO")).toBe(true);
    });

    it("returns false for the same value with accents", () => {
      expect(ignoreFunction("fōō")).toBe(false);
    });
  });

  describe("loadFilter", () => {
    afterEach(() => {
      delete process.env["INPUT_FILTER_REPOS"];
    });

    it("returns undefined when no filter is specified", () => {
      expect(loadFilter("filter_repos")).toBeUndefined();
    });

    it("returns single value and trims whitespace", () => {
      const expects = ["token"];

      process.env["INPUT_FILTER_REPOS"] = " token ";

      expect(loadFilter("filter_repos")).toStrictEqual(expects);
    });

    it("returns multiple values", () => {
      const expects = ["foo", "bar", "baz"];

      process.env["INPUT_FILTER_REPOS"] = "foo, bar, baz";

      expect(loadFilter("filter_repos")).toStrictEqual(expects);
    });

    it("removes empty values", () => {
      const expects = ["foo", "bar"];

      process.env["INPUT_FILTER_REPOS"] = " foo,,, bar , ";

      expect(loadFilter("filter_repos")).toStrictEqual(expects);
    });
  });
});
