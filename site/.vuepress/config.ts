import { cut, insertWord } from "nodejs-jieba";
import { fs, getDirname, path } from "@vuepress/utils";
import { defineUserConfig } from "vuepress";
import { copyrightPlugin } from "vuepress-plugin-copyright2";
import { searchProPlugin } from "vuepress-plugin-search-pro";

import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

const words = fs
  .readFileSync(path.resolve(__dirname, "words"), "utf-8")
  .split("\n")
  .filter((line) => line.trim() && !line.startsWith("#"));

words.forEach(insertWord);

export default defineUserConfig({
  title: "in 东师",
  description: "在东师，就用 in 东师",

  lang: "zh-CN",

  head: [
    ["link", { rel: "icon", href: "/logo.svg" }],
    [
      "link",
      {
        rel: "icon",
        href: `/assets/icon/android-chrome-512x512.png`,
        type: "image/png",
        sizes: "192x192",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        href: `/assets/icon/android-chrome-192x192.png`,
        type: "image/png",
        sizes: "192x192",
      },
    ],
    ["meta", { name: "theme-color", content: "#41c98b" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: `/assets/icon/apple-touch-icon.png`,
      },
    ],
    [
      "meta",
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black",
      },
    ],
  ],

  theme,

  plugins: [
    copyrightPlugin({
      disableCopy: true,
      disableSelection: true,
      global: true,
      author: "Mr.Hope",
      license: "CC BY-NC-ND 4.0",
    }),
    searchProPlugin({
      indexContent: true,
      indexOptions: {
        tokenize: (text, fieldName) =>
          fieldName === "id" ? [text] : cut(text, true),
      },
    }),
  ],

  alias: {
    "@theme-hope/components/NormalPage": path.resolve(
      __dirname,
      "components/NormalPage.vue",
    ),
    "@theme-hope/modules/info/components/PageMeta": path.resolve(
      __dirname,
      "components/PageMeta.ts",
    ),
  },

  shouldPrefetch: false,
  shouldPreload: false,
});
