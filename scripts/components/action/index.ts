import { checkKeys } from "@mr-hope/assert-type";

import { type ActionComponentOptions } from "./typings.js";
import { aliasResolve } from "../utils.js";

export const resolveAction = (
  element: ActionComponentOptions,
  location = "",
): void => {
  // `$` alias resolve and file check
  if (element.content)
    element.content = aliasResolve(element.content, "File", location);

  checkKeys(
    element,
    {
      tag: "string",
      header: ["string", "undefined"],
      content: "string",
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getActionMarkdown = (
  component: ActionComponentOptions,
): string => {
  const { content, header } = component;
  const isLink =
    content.match(/^https?:\/\//) ||
    content.match(
      /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?::\d{1,5})?$/,
    );

  return `\
${
  header
    ? `\
#### ${header}

`
    : ""
}\
${
  isLink
    ? `\
[${header || content}](${content})
`
    : `\
\`\`\`text
${content}
\`\`\`
`
}
`;
};
