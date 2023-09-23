import { type BaseComponentOptions } from "../common.js";

export interface ActionComponentOptions extends BaseComponentOptions {
  tag: "action";

  /** 标题 */
  header?: string;

  /** 动作内容 */
  content: string;
}
