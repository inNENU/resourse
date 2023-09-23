import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import { resolveAccount } from "./account/index.js";
import { resolveAction } from "./action/index.js";
import { resolveAudio } from "./audio/index.js";
import { resolveCard } from "./card/index.js";
import { resolveCarousel } from "./carousel/index.js";
import { resolveDoc } from "./doc/index.js";
import { resolveFooter } from "./footer/index.js";
import { resolveGrid } from "./grid/index.js";
import { resolveImg } from "./img/index.js";
import { resolveList } from "./list/index.js";
import { resolveLoading } from "./loading/index.js";
import { resolveLocation } from "./location/index.js";
import { resolvePhone } from "./phone/index.js";
import { resolveTable } from "./table/index.js";
import { resolveText } from "./text/index.js";
import { resolveTitle } from "./title/index.js";
import { type PageConfig, type PageOptions } from "./typings.js";
import { resolveVideo } from "./video/index.js";
import { aliasResolve } from "./utils.js";

/**
 * 处理页面数据
 *
 * @param page 页面数据
 * @param pagePath 页面路径
 *
 * @returns 处理之后的page
 */
// eslint-disable-next-line max-lines-per-function
export const resolvePage = (
  page: PageConfig,
  pagePath = "",
  diffResult = ""
): PageOptions => {
  if (!page) throw new Error(`${pagePath} doesn't contain anything`);

  if (!page.content)
    throw new Error(`${pagePath}.content doesn't contain anything`);

  const { id = pagePath, author, cite, content, time, ...others } = page;
  const images: string[] = [];
  const pageData: PageOptions = {
    ...others,
    id,
    ...(author
      ? { author: Array.isArray(author) ? author.join("、") : author }
      : {}),
    cite: typeof cite === "string" ? [cite] : cite || [],
    content: content.map((element, index) => {
      const { tag } = element;
      /** 当前位置 */
      const position = `${pagePath} page.content[${index}]`;

      // 处理图片
      if (tag === "img") resolveImg(element, position);
      // 设置标题
      else if (tag === "title") resolveTitle(element, position);
      // 设置文字
      else if (tag === "text" || tag === "p" || tag === "ul" || tag === "ol")
        resolveText(element, id, position);
      // 设置文档
      else if (tag === "doc") resolveDoc(element, position);
      // 设置列表组件
      else if (tag === "list" || tag === "functional-list")
        resolveList(element, id, position);
      // 设置网格组件
      else if (tag === "grid") resolveGrid(element, id, position);
      // 设置页脚
      else if (tag === "footer") resolveFooter(element, position);
      // 设置电话
      else if (tag === "phone") resolvePhone(element, position);
      // 设置轮播图
      else if (tag === "carousel") resolveCarousel(element, position);
      // 设置介绍
      else if (tag === "account") resolveAccount(element, position);
      // 设置卡片
      else if (tag === "card") resolveCard(element, id, position);
      // 检测动作
      else if (tag === "action") resolveAction(element, position);
      // 检测复音频
      else if (tag === "audio") resolveAudio(element, position);
      // 检测视频
      else if (tag === "video") resolveVideo(element, position);
      // 检测地点
      else if (tag === "location") resolveLocation(element, position);
      // 检测表格
      else if (tag === "table") resolveTable(element, position);
      // 检测加载
      else if (tag === "loading") resolveLoading(element, position);
      else
        console.warn(
          `${pagePath} page.content[${index}] 存在非法 tag ${
            tag as unknown as string
          }`
        );

      return element;
    }),
  };

  if (!pageData.cite?.length) delete page.cite;
  if (images.length) pageData.images = images;

  if (time) {
    // update time
    if (diffResult.includes(`pages/${pageData.id}`)) {
      const date = new Date();

      const timeText = `${date.getFullYear()} 年 ${
        date.getMonth() + 1
      } 月 ${date.getDate()} 日${
        (date.getHours() !== 0 && date.getHours() !== 8) ||
        date.getMinutes() ||
        date.getSeconds()
          ? ` ${date.toTimeString().split(" ")[0]}`
          : ""
      }`;

      writeFileSync(
        `./pages/${pagePath}.yml`,
        readFileSync(`./pages/${pagePath}.yml`, { encoding: "utf-8" }).replace(
          /^time: .+$/m,
          `time: ${date.toISOString()}`
        ),
        { encoding: "utf-8" }
      );
      pageData.time = timeText;
    } else {
      const timeText = `${time.getFullYear()} 年 ${
        time.getMonth() + 1
      } 月 ${time.getDate()} 日${
        (time.getHours() !== 0 && time.getHours() !== 8) ||
        time.getMinutes() ||
        time.getSeconds()
          ? ` ${time.toTimeString().split(" ")[0]}`
          : ""
      }`;

      pageData.time = timeText;
    }
  }

  if (page.icon)
    if (
      !page.icon.match(/^https?:\/\//) &&
      !page.icon.match(/\./) &&
      !existsSync(`./data/icon/${page.icon}.svg`)
    ) {
      console.warn(`Icon ${page.icon} not exist in ${pagePath}`);
    }
    // `$` alias resolve and file check
    else page.icon = aliasResolve(page.icon, "Image", pagePath);

  checkKeys(
    pageData,
    {
      title: "string",
      id: "string",
      // icon: "string",
      icon: ["string", "undefined"],
      desc: ["string", "undefined"],
      author: ["string", "undefined"],
      time: ["string", "undefined"],
      grey: ["boolean", "undefined"],
      content: "array",
      hidden: ["boolean", "undefined"],
      shareable: ["boolean", "undefined"],
      contact: ["boolean", "undefined"],
      outdated: ["boolean", "undefined"],
      cite: ["string[]", "undefined"],
      photo: ["string[]", "undefined"],
      images: ["string[]", "undefined"],
    },
    `${pagePath} page`
  );

  return pageData;
};
