import { type BaseComponentOptions } from "../common.js";

export interface AudioComponentOptions extends BaseComponentOptions {
  tag: "audio";
  /** 媒体文件的在线网址或本地路径	 */
  src: string;
  /**
   * 是否循环播放
   *
   * @default false
   */
  loop?: boolean;
  /**
   * 是否显示默认控件
   *
   * @default true
   */
  controls?: boolean;
  /**
   * 音频名字
   *
   * @description controls 为 false 时无效
   */
  name?: string;
  /**
   * 音频作者
   *
   * @description controls 为 false 时无效
   */
  author?: string;
}
