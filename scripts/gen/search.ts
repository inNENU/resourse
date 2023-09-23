import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { load } from "js-yaml";

import { type PageOptions } from "../components/typings.js";
import { getFileList } from "../utils/index.js";

const enum SearchItemType {
  Page = 0,
  ID = 1,
}

const enum SearchIndexType {
  Title = 1,
  Heading = 2,
  Text = 3,
  Image = 4,
  Card = 5,
  Doc = 6,
}

export type TitleSearchIndex = [SearchIndexType.Title, string];
export type HeadingSearchIndex = [SearchIndexType.Heading, string];
export type TextSearchIndex = [SearchIndexType.Text, string];
export type ImageSearchIndex = [
  SearchIndexType.Image,
  { desc: string; icon: string },
];
export type CardSearchIndex = [
  SearchIndexType.Card,
  { title: string; desc: string },
];
export type DocSearchIndex = [
  SearchIndexType.Doc,
  { name: string; icon: string },
];
export type SearchIndex =
  | TitleSearchIndex
  | HeadingSearchIndex
  | TextSearchIndex
  | ImageSearchIndex
  | DocSearchIndex
  | CardSearchIndex;

export type IDContentIndex = [
  type: SearchItemType.ID,
  /** 页面名称 */
  name: string,
  /** 搜索索引 */
  indexes: SearchIndex[],
];

export type PageIndex = [
  type: SearchItemType.Page,
  /** 页面名称 */
  name: string,
  /** 页面图标 */
  icon: string,
  /** 页面标签 */
  tags?: string[],
];

export type SearchMap = Record<
  // 页面 ID 或 路径
  string,
  // 页面内容
  IDContentIndex | PageIndex
>;

// 创建搜索字典
const createSearchMap = (folder: string): SearchMap => {
  const fileList = getFileList(folder, "json");

  const searchMap: SearchMap = {};

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(folder, filePath), {
      encoding: "utf-8",
    });
    const page = <PageOptions>JSON.parse(content);
    const id = `${folder}/${filePath}`.replace(/\.\/d\/(.*)\.json/u, "$1");

    // 生成对应页面的索引对象
    const pageIndex: IDContentIndex = [SearchItemType.ID, page.title, []];

    searchMap[id] = pageIndex;

    // 将页面的标题写入搜索详情中
    page.content.forEach((element) => {
      /** 写入段落大标题 */
      if (element.tag === "title")
        pageIndex[2].push([SearchIndexType.Title, element.text]);
      else if (
        element.tag === "text" ||
        element.tag === "ul" ||
        element.tag === "ol" ||
        element.tag === "p"
      ) {
        /** 写入段落标题 */
        if (element.heading && typeof element.heading === "string")
          pageIndex[2].push([SearchIndexType.Heading, element.heading]);

        /** 写入段落文字 */
        element.text?.forEach((item) => {
          pageIndex[2].push([SearchIndexType.Text, item]);
        });
      } else if (element.tag === "img" && element.desc)
        pageIndex[2].push([
          SearchIndexType.Image,
          {
            desc: element.desc,
            icon: element.src.match(/\.jpe?g$/i)
              ? "jpg"
              : element.src.match(/\.png$/i)
              ? "png"
              : "document",
          },
        ]);
      else if (element.tag === "list") {
        /** 写入段落标题 */
        if (element.header && typeof element.header === "string")
          pageIndex[2].push([SearchIndexType.Heading, element.header]);

        /** 写入段落文字  */
        element.items?.forEach((config) => {
          if (config.text && !config.path && !config.url)
            pageIndex[2].push([SearchIndexType.Text, config.text]);
        });
      } else if (element.tag === "card")
        pageIndex[2].push([
          SearchIndexType.Card,
          {
            title: element.title,
            desc: element.desc || "",
          },
        ]);
      else if (element.tag === "doc")
        pageIndex[2].push([
          SearchIndexType.Doc,
          {
            name: element.name,
            icon: element.icon,
          },
        ]);
      else if (element.tag === "table") {
        if (element.caption)
          pageIndex[2].push([SearchIndexType.Heading, element.caption]);

        pageIndex[2].push([
          SearchIndexType.Heading,
          element.header.join(" | "),
        ]);

        element.body.forEach((row) => {
          pageIndex[2].push([SearchIndexType.Text, row.join(" | ")]);
        });
      } else if (element.tag === "account") {
        pageIndex[2].push([SearchIndexType.Heading, element.name]);
        if (element.detail)
          pageIndex[2].push([SearchIndexType.Text, element.detail]);
        if (element.desc)
          pageIndex[2].push([SearchIndexType.Text, element.desc]);
      } else if (element.tag === "phone") {
        if (element.header)
          pageIndex[2].push([SearchIndexType.Heading, element.header]);
        pageIndex[2].push([
          SearchIndexType.Text,
          `${element.lName || ""}${element.fName}: ${element.num}`,
        ]);
      }
    });
  });

  return searchMap;
};

const generateFunctionSearchMap = (): SearchMap => {
  const functionSearchData = <
    {
      text: string;
      icon: string;
      url: string;
      tags?: string[];
    }[]
  >load(readFileSync("./data/search/function.yml", { encoding: "utf-8" }));

  const functionSearchMap: SearchMap = {};

  functionSearchData.forEach((item) => {
    if (item.tags)
      functionSearchMap[item.url] = [
        SearchItemType.Page,
        item.text,
        item.icon,
        item.tags,
      ];
    else
      functionSearchMap[item.url] = [SearchItemType.Page, item.text, item.icon];
  });

  return functionSearchMap;
};

/** 生成关键词 */
export const genSearchMap = (): void => {
  console.log("Generating search index...");

  const guideSearchMap = {
    ...createSearchMap("./d/guide"),
    ...createSearchMap("./d/newcomer"),
  };
  const introSearchMap = {
    ...createSearchMap("./d/apartment"),
    ...createSearchMap("./d/intro"),
    ...createSearchMap("./d/school"),
  };
  const functionSearchMap = generateFunctionSearchMap();

  // 写入关键词列表
  writeFileSync("./d/guide.json", JSON.stringify(guideSearchMap));
  writeFileSync("./d/intro.json", JSON.stringify(introSearchMap));
  writeFileSync("./d/function.json", JSON.stringify(functionSearchMap));
  writeFileSync(
    "./d/all.json",
    JSON.stringify({
      ...guideSearchMap,
      ...introSearchMap,
      ...functionSearchMap,
    }),
  );

  console.log("Search index generated");
};
