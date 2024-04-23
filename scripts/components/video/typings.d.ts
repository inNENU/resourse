import type { BaseComponentOptions } from "../common.js";

export interface Danmu {
  text: string;
  color: string;
  time: number;
}

export interface VideoComponentOptions extends BaseComponentOptions {
  tag: "video";

  /** 媒体文件的在线网址或本地路径	 */
  src: string;

  /** 视频的标题 */
  title?: string;

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
   * 视频封面的图片网络资源地址
   *
   * @description controls 为 false 时无效
   */
  poster?: string;
  /**
   * 是否自动播放
   *
   * @default false
   */
  autoplay?: boolean;
  /** 视频初始播放位置 */
  startTime?: number;
  /** 弹幕列表 */

  /**
   * 是否显示弹幕按钮
   *
   * @description 只在初始化有效
   * @default true
   */
  danmuBtn?: boolean;

  danmuList: Danmu[];
}
