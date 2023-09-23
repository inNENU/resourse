import { type BaseComponentOptions } from "../common.js";

export interface TextComponentOptions extends BaseComponentOptions {
  /** 文字标签 */
  tag: "text" | "p" | "ol" | "ul";
  /**
   * 段落类型
   *
   * @default 'none'
   */
  type?: "tip" | "warning" | "danger" | "info" | "note" | "none";
  /** 段落标题 */
  heading?: string | true;
  /** 段落文字 */
  text?: string[];
  /** 段落文字样式 */
  style?: string;
  /**
   * 跳转到的路径
   *
   * @description 只有当指定样式时才有效
   */
  path?: string;
  /**
   * 段落对齐方式
   *
   * @default "left"
   */

  align?: "left" | "right" | "center" | "justify";
}
