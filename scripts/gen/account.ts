import { readFileSync, writeFileSync } from "node:fs";

import { resolveAlias } from "../components/utils.js";
import { getFileList, promiseQueue } from "../utils/index.js";

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
    (['"', ": "].some((item) => encodedText.includes(item)) ||
      encodedText.startsWith("@"));

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

export const generateAccount = (filePath: string): Promise<void> => {
  let data = readFileSync(`./data/account/${filePath}`, {
    encoding: "utf-8",
  });

  const results = data
    .split("\n")
    .map((item) => /- url: (.*)$/.exec(item)?.[1] ?? "")
    .filter((item) => item.length);

  return promiseQueue(
    results.map(
      (item) => () =>
        fetch(item)
          .then((res) => res.text())
          .then((content) => {
            const supportedOGP = content.includes("<meta property");

            const cover = supportedOGP
              ? /<meta property="og:image" content="(.*?)" \/>/.exec(
                  content,
                )?.[1]
              : /msg_cdn_url = "(.*)"/.exec(content)?.[1];
            const title = supportedOGP
              ? /<meta property="og:title" content="(.*?)" \/>/.exec(
                  content,
                )?.[1]
              : /msg_title = '(.*)'/.exec(content)?.[1];
            const desc = supportedOGP
              ? /<meta property="og:description" content="(.*?)" \/>/.exec(
                  content,
                )?.[1]
              : /msg_desc = htmlDecode\("(.*)"\)/.exec(content)?.[1];

            if (
              typeof cover !== "string" ||
              typeof title !== "string" ||
              typeof desc !== "string"
            ) {
              throw new Error(
                `Parsing failed: ${JSON.stringify({ supportedOGP, cover, title, desc })}`,
              );
            }

            data = data.replace(
              `- url: ${item}`,
              `- cover: ${cover}\n    title: ${decodeText(title)}\n${
                desc ? `    desc: ${decodeText(desc)}\n` : ""
              }    url: ${item}`,
            );
          })
          .then(() => console.log(`${item} fetched`))
          .catch((err) => console.error(`Fetching ${item} failed:`, err)),
    ),
  ).then(() => {
    writeFileSync(`./data/account/${filePath}`, data, {
      encoding: "utf-8",
    });
  });
};

const fileList = getFileList("./data/account", "yml");

await promiseQueue(
  fileList.map((item) => (): Promise<void> => generateAccount(item)),
);
