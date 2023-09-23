import { assertType, checkKeys } from "@mr-hope/assert-type";

import { type TableComponentOptions } from "./typings.js";

export const resolveTable = (
  element: TableComponentOptions,
  location = "",
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      caption: ["string", "undefined"],
      header: "string[]",
      body: "array",
      env: ["string[]", "undefined"],
    },
    location,
  );

  element.body.forEach((item) => {
    assertType(item, "string[]");
  });
};

export const getTableMarkdown = (component: TableComponentOptions): string => {
  const { caption, header, body } = component;

  return `\
${
  caption
    ? `### ${caption}

`
    : ""
}\
${header.map((item) => item.replace(/|/g, "\\|")).join(" | ")}
${header.map(() => ":-:").join(" | ")}
${body
  .map((item) => item.map((item) => item.replace(/|/g, "\\|")).join(" | "))
  .join("\n")}

`;
};
