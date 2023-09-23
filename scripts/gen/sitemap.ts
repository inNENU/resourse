import { readFileSync, writeFileSync } from "node:fs";

import { getFileList } from "../utils/index.js";

export interface SiteMapRule {
  /**
   * 命中该规则的页面是否能被索引
   *
   * @default "allow"
   */
  action: "allow" | "disallow";
  /**
   * 页面的路径
   *
   * `*` 表示所有页面
   */
  page: string;
  /** 当 page 字段指定的页面在被本规则匹配时可能使用的页面参数名称的列表(不含参数值) */
  params: string[];
  /**
   * 当 page 字段指定的页面在被本规则匹配时，此参数说明 params 匹配方式
   *
   * - `exact`: 当小程序页面的参数列表等于 params 时，规则命中
   * - `inclusive`:	当小程序页面的参数列表包含 params 时，规则命中
   * - `exclusive`:	当小程序页面的参数列表与 params 交集为空时，规则命中
   * - `partial`:	当小程序页面的参数列表与 params 交集不为空时，规则命中
   */
  matching: "exact" | "inclusive" | "exclusive" | "partial";
  /** 优先级，值越大则规则越早被匹配，否则默认从上到下匹配 */
  priority: number;
}

export const genSitemap = (): void => {
  console.log("Generating Sitemap...");
  const fileList = getFileList("./pages/guide", "yml");
  const sitemapContent = <{ rules: SiteMapRule[] }>(
    JSON.parse(readFileSync("../app/sitemap.json", { encoding: "utf-8" }))
  );

  sitemapContent.rules[0].params = fileList.map(
    (filePath) => `scene=${filePath.replace(/\.yml$/u, "")}`,
  );

  writeFileSync("../app/sitemap.json", JSON.stringify(sitemapContent), {
    encoding: "utf-8",
  });
  console.log("Sitemap generated!");
};
