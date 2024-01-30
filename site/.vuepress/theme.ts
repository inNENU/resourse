import { insertWord } from "nodejs-jieba";
import { fs, path } from "vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";

const words = fs
  .readFileSync(path.resolve(__dirname, "words"), "utf-8")
  .split("\n")
  .filter((line) => line.trim() && !line.startsWith("#"));

words.forEach(insertWord);

export default hopeTheme(
  {
    favicon: "/favicon.ico",
    logo: "/logo.svg",
    hostname: "https://innenu.com",
    repo: "inNENU/resource",

    iconAssets: "fontawesome",

    editLink: false,
    footer: "在东师，就用 inNENU",
    copyright: `使用 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> 协议`,
    displayFooter: true,

    navbar: [
      "/",
      "/newcomer/",
      "/guide/",
      "/intro/",
      "/school/",
      "/apartment/",
      "/contributing/",
    ],

    sidebar: {
      "/": false,
      "/contributing/": "structure",
      "/apartment/": "structure",
      "/guide/": "structure",
      "/intro/": "structure",
      "/other/": "structure",
      "/newcomer/": "structure",
      "/school/": "structure",
    },

    pageInfo: ["Author", "Original", "Date", "PageView", "ReadingTime", "Word"],

    pure: true,

    metaLocales: {
      date: "更新日期",
    },

    plugins: {
      copyright: {
        disableCopy: true,
        disableSelection: true,
        global: true,
        author: "Mr.Hope",
        license: "CC BY-NC-ND 4.0",
      },

      components: {
        components: ["VidStack"],
        rootComponents: {
          // notice: [
          //   {
          //     path: "/",
          //     title: "本科招生章程",
          //     content: "东师 2023 年本科招生章程已经发布",
          //     actions: [
          //       {
          //         text: "查看详情",
          //         link: "/intro/enroll/under/rule/",
          //       },
          //     ],
          //   },
          // ],
        },
      },

      mdEnhance: {
        align: true,
        attrs: true,
        figure: true,
      },

      searchPro: true,
    },
  },
  { custom: true },
);
