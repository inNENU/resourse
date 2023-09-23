import { checkKeys } from "@mr-hope/assert-type";

import { FooterComponentOptions } from "./typings.js";

export const resolveFooter = (
  element: FooterComponentOptions,
  location = "",
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      author: ["string", "undefined"],
      time: ["string", "undefined"],
      desc: ["string", "undefined"],
      env: ["string[]", "undefined"],
      cite: ["string[]", "undefined"],
    },
    location,
  );
};
