import type { BaseComponentOptions } from "../common.js";

export interface BaseGridComponentItemOptions extends BaseComponentOptions {
  /** 网格文字 */
  text: string;
  /** 网格图标的在线路径或本地路径 */
  icon: string;
}

export interface NormalGridComponentItemOptions
  extends BaseGridComponentItemOptions {
  /** 对应页面的文件路径 */
  path: string;
  /** 解析的页面路径 */
  url?: string;
}

export interface PageGridComponentItemOptions
  extends BaseGridComponentItemOptions {
  /** 小程序页面路径 */
  url: string;
}

export interface MiniprogramGridComponentItemOptions
  extends BaseGridComponentItemOptions {
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

export type GridComponentItemOptions =
  | MiniprogramGridComponentItemOptions
  | NormalGridComponentItemOptions
  | PageGridComponentItemOptions;

export interface GridComponentOptions extends BaseComponentOptions {
  tag: "grid";
  header?: string | false;
  items: GridComponentItemOptions[];
  /** 网格页脚 */
  footer?: string;
}
