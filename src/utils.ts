import { getInput } from "@actions/core";

export const ignoreCaseCompare = function (left: string) {
  return function (right: string): boolean {
    return left.localeCompare(right, "en", { sensitivity: "accent" }) === 0;
  };
};

export function loadFilter(inputName: string): string[] | undefined {
  const inputValue = getInput(inputName, {
    required: false,
    trimWhitespace: true,
  });

  if (!inputValue) {
    return undefined;
  }

  const result = inputValue
    .split(",")
    .map((filter) => filter.trim())
    .filter((filter) => filter !== "");

  return result.length === 0 ? undefined : result;
}
