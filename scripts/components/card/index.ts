import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import type { CardComponentOptions } from "./typings.js";
import { getMarkdownPath, resolveAlias, resolvePath } from "../utils.js";

export const resolveCard = (
  component: CardComponentOptions,
  pageId: string,
  location = "",
): void => {
  if (component.logo) {
    // check icons
    if (
      !/^https?:\/\//.exec(component.logo) &&
      !/\./.exec(component.logo) &&
      !existsSync(`./data/icon/${component.logo}.svg`)
    ) {
      console.error(`Icon ${component.logo} not exist in ${location}`);
    } else component.logo = resolveAlias(component.logo, "Image", location);
  }

  if (component.cover)
    component.cover = resolveAlias(component.cover, "Image", location);

  if ("path" in component) {
    if (component.path.startsWith("/")) {
      const path = resolvePath(component.path);

      if (!existsSync(`./pages/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);

      component.path = path;
    } else {
      const paths = pageId.split("/");

      paths.pop();

      const path = resolvePath(`${paths.join("/")}/${component.path}`);

      if (!existsSync(`./pages/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);

      component.path = path;
    }
  }

  checkKeys(
    component,
    {
      tag: "string",
      cover: ["string", "undefined"],
      path: ["string", "undefined"],
      url: ["string", "undefined"],
      title: "string",
      desc: ["string", "undefined"],
      logo: ["string", "undefined"],
      name: ["string", "undefined"],
      options: ["object", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );

  // check options
  if ("options" in component)
    checkKeys(
      component.options,
      {
        appId: "string",
        envVersion: {
          type: ["string", "undefined"],
          enum: ["develop", "trial", "release", undefined],
        },
        extraData: ["Record<string, any>", "undefined"],
        path: ["string", "undefined"],
        shortLink: ["string", "undefined"],
      },
      `${location}.options`,
    );
};

export const getCardMarkdown = (component: CardComponentOptions): string => {
  const logo = component.logo
    ? /^https?:\/\//.exec(component.logo)
      ? component.logo
      : resolveAlias(component.logo)
    : null;
  const cover = component.cover ? resolveAlias(component.cover) : null;

  if ("options" in component) return "";

  const { name, desc, title } = component;

  const cardChildren = `
${
  cover
    ? `\
<img class="innenu-card-cover" src="${cover}" alt="" no-view referrerpolicy="no-referer" />
`
    : ""
}
<div class="innenu-card-detail">
  <div class="innenu-card-info">
${
  logo
    ? `\
    <img class="innenu-card-logo" src="${logo}" alt="" no-view />
`
    : ""
}\
${
  name
    ? `\
    <div class="innenu-card-name">${name}</div>
`
    : ""
}\
  </div>
  <div class="innenu-card-title">${title}</div>
${
  desc
    ? `\
  <div class="innenu-card-desc">${desc}</div>
`
    : ""
}\
</div>
`;

  if ("url" in component && /^https?:\/\//.exec(component.url))
    return `\
<a class="innenu-card" href="${component.url}" target="_blank">
${cardChildren}
</a>
`;

  if ("path" in component) {
    return `\
<RouteLink class="innenu-card" to="${getMarkdownPath(component.path)}">
${cardChildren}
</RouteLink>

`;
  }

  return "";
};
