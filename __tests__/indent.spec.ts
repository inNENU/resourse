import { indentMarkdownListItem } from "../scripts/components/utils.js";
import { describe, expect, it } from "vitest";

describe("indent", () => {
  it("split lines", () => {
    const tests = [
      [
        `\
Text
Content\
`,
        `\
Text

Content`,
      ],
    ];

    tests.forEach(([content, result]) => {
      expect(indentMarkdownListItem(content, 0)).toBe(result);
    });
  });

  it("indent given spaces", () => {
    const tests = [
      [
        `\
Text
Content\
`,
        `\
Text

   Content`,
      ],
    ];

    tests.forEach(([content, result]) => {
      expect(indentMarkdownListItem(content, 3)).toBe(result);
    });
  });
});
