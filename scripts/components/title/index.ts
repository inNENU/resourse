import { checkKeys } from "@mr-hope/assert-type";

import { TitleComponentOptions } from "./typings.js";
import { resolveStyle } from "../utils.js";

export const resolveTitle = (
  element: TitleComponentOptions,
  location = "",
): void => {
  // 处理样式
  if (typeof element.style === "object")
    element.style = resolveStyle(element.style);

  checkKeys(
    element,
    {
      tag: "string",
      text: "string",
      style: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getTitleMarkdown = (component: TitleComponentOptions): string => {
  // 处理样式
  if (typeof component.style === "object")
    component.style = resolveStyle(component.style);
  const { text, style } = component;

  return style
    ? `\
## <span style="${style}">${text}</span>

`
    : `\
## ${component.text}

`;
};
