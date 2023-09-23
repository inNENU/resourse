import { type BaseComponentOptions } from "../common.js";

export interface FooterComponentOptions extends BaseComponentOptions {
  tag: "footer";
  /** 作者 */
  author?: string;
  /** 最后更新日期 */
  time?: string;
  /** 额外描述 */
  desc?: string;
  /** 原文链接 */
  cite?: string[];
}
