import { expect, it } from "vitest";

import { camelCase2kebabCase } from "../scripts/components/utils.js";

it("camelCase2kebabCase", () => {
  const tests = [
    ["camelCase2kebabCase", "camel-case2kebab-case"],
    ["aBC", "a-b-c"],
    ["aWord", "a-word"],
  ];

  tests.forEach(([content, result]) => {
    expect(camelCase2kebabCase(content)).toBe(result);
  });
});
