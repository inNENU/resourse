import type { BaseComponentOptions } from "../common.js";

interface BaseCardComponentOptions extends BaseComponentOptions {
  tag: "card";
  /** 卡片标题 */
  title: string;
  /** 卡片描述 */
  desc?: string;
  /** 封面图片在线地址 */
  cover?: string;
  /** 卡片 Logo 地址 */
  logo?: string;
  /** 卡片 Logo 名称 */
  name?: string;
}

export interface NormalCardComponentOptions extends BaseCardComponentOptions {
  /** 跳转的链接 */
  url: string;
}

export interface PageCardComponentOptions extends BaseCardComponentOptions {
  /** 跳转的文件名称 */
  path: string;
  /** 处理后的路径 */
  url?: string;
}

export interface MiniprogramCardComponentOptions
  extends BaseCardComponentOptions {
  /** 要打开的小程序 appId */
  appId: string;

  /** 打开的页面路径 */
  path?: string;

  /** 需要传递给目标小程序的数据， */
  extraData?: Record<string, unknown>;

  /** 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
   *
   * 可选值:
   * - 'develop': 开发版;
   * - 'trial': 体验版;
   * - 'release': 正式版; */
  versionType?: "develop" | "trial" | "release";
}

export type CardComponentOptions =
  | MiniprogramCardComponentOptions
  | NormalCardComponentOptions
  | PageCardComponentOptions;
