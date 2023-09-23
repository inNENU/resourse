import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import { type TextComponentOptions } from "./typings.js";
import { getPath, indent, resolvePath, resolveStyle } from "../utils.js";

export const resolveText = (
  element: TextComponentOptions,
  pageId: string,
  location = "",
): void => {
  // 处理样式
  if (typeof element.style === "object")
    element.style = resolveStyle(element.style);

  // 处理段落
  if (typeof element.text === "string") element.text = [element.text];

  if (element.path) {
    if (element.type === "none" || !element.type)
      console.warn(`${location}: A type must be set when path is set`);

    if (element.path.startsWith("/")) {
      const path = resolvePath(element.path);

      if (!existsSync(`./pages/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);

      element.path = path;
    } else {
      const paths = pageId.split("/");

      paths.pop();

      const path = resolvePath(`${paths.join("/")}/${element.path}`);

      if (!existsSync(`./pages/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);

      element.path = path;
    }
  }

  checkKeys(
    element,
    {
      tag: "string",
      heading: ["string", "boolean", "undefined"],
      type: {
        type: ["string", "undefined"],
        enum: ["info", "tip", "warning", "danger", "note", "none"],
      },
      text: ["string[]", "undefined"],
      style: ["string", "undefined"],
      align: {
        type: ["string", "undefined"],
        enum: ["left", "right", "center", "justify"],
      },
      path: ["string", "undefined"],
      url: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getTextMarkdown = (component: TextComponentOptions): string => {
  // 处理样式
  if (typeof component.style === "object")
    component.style = resolveStyle(component.style);

  // 处理段落
  if (typeof component.text === "string") component.text = [component.text];

  const { align, tag, heading, type, text = [], path } = component;

  return `\
${
  align
    ? `:::: ${align}

`
    : ""
}\
${
  type || heading
    ? `${type ? `::: ${type} ` : ""}${
        typeof heading === "string" ? `${type ? "" : "### "}${heading}` : ""
      }

`
    : ""
}\
${
  text
    .map((item) =>
      tag === "ul"
        ? `- ${indent(item, 3)}`
        : tag === "ol"
        ? `1. ${indent(item, 3)}`
        : item,
    )
    ?.join("\n\n") || ""
}

${path ? `- [查看详情](${getPath(path)})\n\n` : ""}\
${type ? ":::\n\n" : ""}\
${align ? `::::\n\n` : ""}\
`;
};
