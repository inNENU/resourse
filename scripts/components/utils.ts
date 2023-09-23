import { existsSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

import { assertType } from "@mr-hope/assert-type";

const ASSETS_SERVER = "https://assets.innenu.com";
const SERVER = "https://mp.innenu.com";

export const camelCase2kebabCase = (str: string): string => {
  const hyphenateRE = /([^-])([A-Z])/gu;

  return str
    .replace(hyphenateRE, "$1-$2")
    .replace(hyphenateRE, "$1-$2")
    .toLowerCase();
};

export const resolvePath = (path: string): string =>
  relative(
    process.cwd(),
    resolve(
      path.replace(/\/\//u, "/").replace(/^\//u, "").replace(/\/$/u, "/index"),
    ),
  ).replaceAll(sep, "/");

/** 处理样式 */
export const resolveStyle = (styleObj: Record<string, string>): string => {
  assertType(styleObj, "Record<string,string>", "style");

  let result = "";

  for (const key in styleObj)
    result += `${camelCase2kebabCase(key)}:${styleObj[key]};`;

  return result;
};

export const aliasResolve = (link = "", type = "", location = ""): string => {
  if (typeof link === "string" && link.startsWith("$")) {
    const localePath = link.replace(/^\$/, "./");

    if (existsSync(localePath)) return link.replace(/^\$/, `${ASSETS_SERVER}/`);

    console.warn(`${type} ${localePath} not exist in ${location}`);
  }

  return link;
};

export const getIconLink = (icon = ""): string =>
  icon
    ? icon.match(/^https?:\/\//)
      ? icon
      : icon.startsWith("$")
      ? aliasResolve(icon)
      : `${SERVER}/data/icon/${icon}.svg`
    : "";

export const indent = (content: string, indent = 0): string =>
  content
    .split("\n")
    .map((line, index) =>
      index === 0 ? line : `${new Array(indent).fill("").join("")}${line}`,
    )
    .join("\n\n");

export const getPath = (path: string): string =>
  `${path.replace(/\/(?:index)?$/, "/README")}.md`;
