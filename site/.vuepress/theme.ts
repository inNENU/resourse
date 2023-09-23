import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme(
  {
    favicon: "/favicon.ico",
    logo: "/logo.svg",
    hostname: "https://innenu.com",
    repo: "inNENU/resource",

    editLink: false,
    footer: "在东师，就用 in 东师",
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

    pageInfo: ["Author", "Original", "Date", "PageView", "ReadingTime", "Word"],

    pure: true,
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

    metaLocales: {
      date: "更新日期",
    },

    plugins: {
      components: {
        components: ["AudioPlayer", "VideoPlayer"],
        rootComponents: {
          notice: [
            // {
            //   path: "/",
            //   title: "本科招生章程",
            //   content: "东师 2023 年本科招生章程已经发布",
            //   actions: [
            //     {
            //       text: "查看详情",
            //       link: "/intro/enroll/under/rule/",
            //     },
            //   ],
            // },
          ],
        },
      },

      feed: {
        atom: true,
        json: true,
        rss: true,
      },

      mdEnhance: {
        align: true,
        attrs: true,
        figure: true,
      },

      sitemap: true,
    },
  },
  { custom: true },
);
