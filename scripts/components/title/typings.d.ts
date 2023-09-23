import { type BaseComponentOptions } from "../common.js";

export interface TitleComponentOptions extends BaseComponentOptions {
  tag: "title";
  /** 标题文字 */
  text: string;
  /** 标题 css 样式 */
  style?: string;
}
