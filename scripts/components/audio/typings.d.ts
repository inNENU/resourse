import type { BaseComponentOptions } from "../common.js";

export interface AudioComponentOptions extends BaseComponentOptions {
  tag: "audio";
  /** 媒体文件的在线网址或本地路径 */
  src: string;
  /**
   * 音频名字
   */
  name?: string;
  /**
   * 音频作者
   */
  author?: string;
  /**
   * 音频封面
   */
  poster?: string;
  /**
   * 是否自动播放
   *
   * @default false
   */
  autoplay?: boolean;
  /**
   * 是否循环播放
   *
   * @default false
   */
  loop?: boolean;
}
