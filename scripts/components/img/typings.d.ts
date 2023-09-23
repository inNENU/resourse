import { type BaseComponentOptions, type ImageMode } from "../common.js";

export interface ImageComponentOptions extends BaseComponentOptions {
  tag: "img";
  /** 图片的本地路径或在线网址 */
  src: string;
  /** 图片在服务器上的网址 */
  res?: string;
  /** 图片的描述文字 */
  desc?: string;
  /**
   * 图片懒加载
   *
   * @default true
   */
  lazy?: false;
  /**
   * 是否添加水印
   *
   * @default false
   */
  watermark?: false;
  /**
   * 图片显示模式
   *
   * @default "widthFix"
   */
  imgMode?: ImageMode;
}
