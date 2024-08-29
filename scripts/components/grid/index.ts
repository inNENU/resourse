import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import type { GridComponentOptions } from "./typings.js";
import { getIconLink, getMarkdownPath, resolvePath } from "../utils.js";

export const resolveGrid = (
  element: GridComponentOptions,
  pageId: string,
  location = "",
): void => {
  element.items?.forEach((gridItem) => {
    // 处理路径
    if ("path" in gridItem && !("appId" in gridItem))
      if (gridItem.path.startsWith("/")) {
        const path = resolvePath(gridItem.path);

        if (!existsSync(`./pages/${path}.yml`))
          console.error(`Path ${path} not exists in ${location}`);

        gridItem.path = path;
      } else {
        const paths = pageId.split("/");

        paths.pop();

        const path = resolvePath(`${paths.join("/")}/${gridItem.path}`);

        if (!existsSync(`./pages/${path}.yml`))
          console.error(`Path ${path} not exists in ${location}`);

        gridItem.path = path;
      }

    if (
      gridItem.icon &&
      !/^https?:\/\//.exec(gridItem.icon) &&
      !/\./.exec(gridItem.icon) &&
      !existsSync(`./data/icon/${gridItem.icon}.svg`)
    ) {
      console.error(`Icon ${gridItem.icon} not exist in ${location}`);
    }

    checkKeys(
      gridItem,
      {
        text: "string",
        icon: "string",
        base64Icon: ["string", "undefined"],
        path: ["string", "undefined"],
        url: ["string", "undefined"],
        appId: ["string", "undefined"],
        extraData: ["Record<string, any>", "undefined"],
        versionType: {
          type: ["string", "undefined"],
          enum: ["develop", "trial", "release", undefined],
        },
        env: ["string[]", "undefined"],
      },
      `${location}.content`,
    );
  });

  checkKeys(
    element,
    {
      tag: "string",
      header: { type: ["string", "undefined"], additional: [false] },
      items: "array",
      footer: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getGridMarkdown = (component: GridComponentOptions): string => {
  const { header, footer, items = [] } = component;

  return `\
${
  header
    ? `\
#### ${header} {.innenu-grid-header}

`
    : ""
}\
<div class="innenu-grid">

${items
  .map((item) => {
    if ("env" in item && !item.env.includes("web")) return null;
    if ("type" in item || "url" in item) return null;

    const { icon, text, path } = item;

    const resolvedIcon = getIconLink(icon);

    const gridItemContent = `
${
  resolvedIcon
    ? `<img class="innenu-grid-icon" src="${resolvedIcon}" alt="" no-view />`
    : ""
}
<div class="innenu-grid-text">
${text.replace(/\n/g, "<br />")}
</div>
`;

    return `\
${
  path
    ? `<RouteLink class="innenu-grid-item" to="${getMarkdownPath(path)}">
${gridItemContent}
</RouteLink>`
    : `\
<div class="innenu-grid-item">
${gridItemContent}
</div>`
}
`;
  })
  .filter((item): item is string => item !== null)
  .join("\n")}

</div>

${
  footer
    ? `\
<div class="innenu-grid-footer">
${footer}
</div>
`
    : ""
}\

`;
};
