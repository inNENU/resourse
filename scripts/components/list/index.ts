import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import {
  type FunctionalListComponentOptions,
  type ListComponentOptions,
} from "./typings.js";
import { aliasResolve, getIconLink, getPath, resolvePath } from "../utils.js";

export const resolveList = (
  element: ListComponentOptions | FunctionalListComponentOptions,
  pageId: string,
  location = "",
): void => {
  element.items?.forEach((listItem, index) => {
    if (listItem.icon)
      if (
        !listItem.icon.match(/^https?:\/\//) &&
        !listItem.icon.match(/\./) &&
        !existsSync(`./data/icon/${listItem.icon}.svg`)
      ) {
        console.warn(`Icon ${listItem.icon} not exist in ${location}`);
      }
      // `$` alias resolve and file check
      else listItem.icon = aliasResolve(listItem.icon, "Image", location);

    if ("type" in listItem) {
      if (listItem.type === "navigator") {
        if (!listItem.openType) listItem.openType = "navigate";

        checkKeys(
          listItem,
          {
            text: "string",
            icon: ["string", "undefined"],
            base64Icon: ["string", "undefined"],
            desc: ["string", "undefined"],
            type: {
              type: "string",
              enum: ["navigator"],
            },
            openType: {
              type: ["string", "undefined"],
              enum: [
                "navigate",
                "redirect",
                "switchTab",
                "reLaunch",
                "navigateBack",
                "exit",
                undefined,
              ],
            },
            target: {
              type: ["string", "undefined"],
              enum: ["self", "miniProgram", undefined],
            },
            url: ["string", "undefined"],
            env: ["string[]", "undefined"],
          },
          `${location}.content[${index}]`,
        );
      } else if (listItem.type === "switch")
        checkKeys(
          listItem,
          {
            text: "string",
            icon: ["string", "undefined"],
            base64Icon: ["string", "undefined"],
            desc: ["string", "undefined"],
            type: {
              type: "string",
              enum: ["switch"],
            },
            key: "string",
            handler: ["string", "undefined"],
            color: ["string", "undefined"],
            env: ["string[]", "undefined"],
          },
          `${location}.content[${index}]`,
        );
      else if (listItem.type === "slider")
        checkKeys(
          listItem,
          {
            text: "string",
            icon: ["string", "undefined"],
            base64Icon: ["string", "undefined"],
            desc: ["string", "undefined"],
            type: {
              type: "string",
              enum: ["slider"],
            },
            key: "string",
            handler: ["string", "undefined"],
            min: ["number", "undefined"],
            max: ["number", "undefined"],
            step: ["number", "undefined"],
            env: ["string[]", "undefined"],
          },
          `${location}.content[${index}]`,
        );
      else if (listItem.type === "picker")
        checkKeys(
          listItem,
          {
            text: "string",
            icon: ["string", "undefined"],
            base64Icon: ["string", "undefined"],
            desc: ["string", "undefined"],
            type: {
              type: "string",
              enum: ["picker"],
            },
            select: "array",
            key: "string",
            handler: ["string", "undefined"],
            single: ["boolean", "undefined"],
            inlay: ["boolean", "undefined"],
            env: ["string[]", "undefined"],
          },
          `${location}.content[${index}]`,
        );
      else if (listItem.type === "button")
        checkKeys(
          listItem,
          {
            text: "string",
            icon: ["string", "undefined"],
            base64Icon: ["string", "undefined"],
            desc: ["string", "undefined"],
            type: {
              type: "string",
              enum: ["button"],
            },
            handler: ["string", "undefined"],
            openType: {
              type: ["string", "undefined"],
              enum: [
                "contact",
                "share",
                "launchApp",
                "openSetting",
                "feedback",
                "getPhoneNumber",
                "openGroupProfile",
                "addFriend",
                "addColorSign",
                "openPublicProfile",
                "openGuildProfile",
                "addGroupApp",
                "shareMessageToFriend",
                "addToFavorites",
                undefined,
              ],
            },
            openId: ["string", "undefined"],
            groupId: ["string", "undefined"],
            guildId: ["string", "undefined"],
            disabled: ["boolean", "undefined"],
            env: ["string[]", "undefined"],
          },
          `${location}.content[${index}]`,
        );
      else
        console.error(
          `${location}.content[${index}] 存在未知 item 配置:`,
          listItem,
        );
    }
    // 处理路径
    else if (listItem.path) {
      if (listItem.path.startsWith("/")) {
        const path = resolvePath(listItem.path);

        if (!existsSync(`./pages/${path}.yml`))
          console.error(`Path ${path} not exists in ${location}`);

        listItem.path = path;
      } else {
        const paths = pageId.split("/");

        paths.pop();

        const path = resolvePath(`${paths.join("/")}/${listItem.path}`);

        if (!existsSync(`./pages/${path}.yml`))
          console.error(`Path ${path} not exists in ${location}`);

        listItem.path = path;
      }

      checkKeys(
        listItem,
        {
          text: "string",
          icon: ["string", "undefined"],
          base64Icon: ["string", "undefined"],
          desc: ["string", "undefined"],
          path: ["string"],
          url: ["string", "undefined"],
          env: ["string[]", "undefined"],
        },
        `${location}.content[${index}]`,
      );
    } else
      checkKeys(
        listItem,
        {
          text: "string",
          icon: ["string", "undefined"],
          base64Icon: ["string", "undefined"],
          desc: ["string", "undefined"],
          url: ["string", "undefined"],
          env: ["string[]", "undefined"],
        },
        `${location}.content[${index}]`,
      );
  });

  checkKeys(
    element,
    {
      tag: "string",
      header: ["string", "boolean", "undefined"],
      items: "array",
      footer: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getListMarkdown = (
  component: ListComponentOptions | FunctionalListComponentOptions,
): string => {
  const { header, footer, items = [] } = component;

  return `\
${
  header
    ? `\
#### ${header} {.innenu-list-header}

`
    : ""
}\
<div class="innenu-list">

${items
  .map((item) => {
    if ("env" in item && !item.env.includes("web")) return null;
    if ("type" in item || "url" in item) return null;

    const { icon, text, path, desc } = item;

    const resolvedIcon = getIconLink(icon);

    const listItemContent = `
${
  resolvedIcon
    ? `<img class="innenu-list-icon" src="${resolvedIcon}" no-view />`
    : ""
}
<div class="innenu-list-detail">
<div class="innenu-list-text">
${text.replace(/\n/g, "<br />")}
</div>
${
  desc
    ? `\
<div class="innenu-list-desc">
${desc}
</div>
`
    : ""
}
</div>
`;

    return `\
${
  path
    ? `<VPLink class="innenu-list-item" to="${getPath(path)}">
${listItemContent}
</VPLink>`
    : `\
<div class="innenu-list-item">
${listItemContent}
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
<div class="innenu-list-footer">
${footer}
<div>
`
    : ""
}\

`;
};
