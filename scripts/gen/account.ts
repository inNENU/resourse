import { readFileSync, writeFileSync } from "node:fs";

import axios from "axios";

import { resolveAlias } from "../components/utils.js";
import { getFileList } from "../utils/index.js";

interface WechatAccountInfo {
  name: string;
  desc?: string;
  logo: string;
  path?: string;
  id?: number;
  qrcode?: string;
  openid?: string;
}

export interface AccountConfig {
  name: string;
  account: WechatAccountInfo[];
}

const decodeText = (text: string): string => {
  const encodedText = text
    .replace(/\\x0d/g, " ")
    .replace(/\\x0a/g, " ")
    .replace(/\\x26/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/ +/g, " ");
  const shouldWrapWithSingleQuote =
    !encodedText.includes("'") && encodedText.includes('"');
  const shouldWrapWithDoubleQuote =
    !shouldWrapWithSingleQuote &&
    (['"', ": "].some(encodedText.includes) || encodedText.startsWith("@"));

  return shouldWrapWithSingleQuote
    ? `'${encodedText}'`
    : shouldWrapWithDoubleQuote
      ? `"${encodedText.replace(/"/g, '\\"')}"`
      : encodedText;
};

export const checkAccount = (
  data: AccountConfig[],
  location: string,
): AccountConfig[] => {
  data.forEach((item) => {
    item.account.forEach((config) => {
      // `$` alias resolve and file check
      if (config.logo)
        config.logo = resolveAlias(config.logo, "Image", location);
      if (config.qrcode)
        config.qrcode = resolveAlias(config.qrcode, "Image", location);
    });
  });

  return data;
};

export interface AccountDetail {
  name: string;
  detail?: string;
  desc?: string;
  id: string;
  logo: string;
  qrcode: string;
  article: { cover: string; title: string; url: string; desc?: string }[];
}

export const checkAccountDetail = (
  data: AccountDetail,
  location: string,
): AccountDetail => {
  // `$` alias resolve and file check
  if (data.logo) data.logo = resolveAlias(data.logo, "Image", location);
  if (data.qrcode) data.qrcode = resolveAlias(data.qrcode, "Image", location);

  return data;
};

export const genAccount = (filePath: string): Promise<void> => {
  let content = readFileSync(`./data/account/${filePath}`, {
    encoding: "utf-8",
  });

  const results = content
    .split("\n")
    .map((item) => (/- url: (.*)$/.exec(item) || [])[1] || "")
    .filter((item) => item.length);

  return Promise.all(
    results.map((item) =>
      axios.get<string>(item).then(({ data }) => {
        const [, cover = ""] =
          /<meta property="og:image" content="(.*?)" \/>/.exec(data) || [];
        const [, title = ""] =
          /<meta property="og:title" content="(.*?)" \/>/.exec(data) || [];
        const [, desc = ""] =
          /<meta property="og:description" content="(.*?)" \/>/.exec(data) ||
          [];

        content = content.replace(
          `- url: ${item}`,
          `- cover: ${cover}\n    title: ${decodeText(title)}\n${
            desc ? `    desc: ${decodeText(desc)}\n` : ""
          }    url: ${item}`,
        );
      }),
    ),
  ).then(() => {
    writeFileSync(`./data/account/${filePath}`, content, {
      encoding: "utf-8",
    });
  });
};

const fileList = getFileList("./data/account", "yml");

fileList.forEach((item) => {
  genAccount(item);
});
