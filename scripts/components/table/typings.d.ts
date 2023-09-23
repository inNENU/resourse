import { type BaseComponentOptions } from "../common.js";

export interface TableComponentOptions extends BaseComponentOptions {
  /** 文字标签 */
  tag: "table";

  /** 表格标题 */
  caption?: string;

  /** 表头 */
  header: string[];

  /** 表格主题 */
  body: string[][];
}
