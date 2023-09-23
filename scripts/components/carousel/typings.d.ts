import { type BaseComponentOptions, type ImageMode } from "../common.js";

export interface CarouselComponentOptions extends BaseComponentOptions {
  tag: "carousel";
  /** swiper 展示的图片的在线网址或本地路径 */
  images: string[];
  /**
   * 轮播图是否填满屏幕宽度
   *
   * @default false
   */
  fill?: boolean;
  /** swiper 的类名 */
  class?: string;
  /** swiper 的样式 */
  style?: string;
  /**
   * 面板指示点
   *
   * @default true
   */
  indicatorDots?: boolean;
  /**
   * 指示点颜色
   *
   * @default '#ffffff88'
   */
  dotColor?: string;
  /**
   * 当前选中的指示点颜色
   *
   * @default '#fff'
   */
  dotActiveColor?: string;
  /**
   * 自动切换
   *
   * @default true
   */
  autoplay?: boolean;
  /**
   * 自动切换时间间隔
   *
   * @default 5000
   */
  interval?: number;
  /**
   * 滑动动画时长
   *
   * @default 500
   */
  duration?: number;
  /**
   * 衔接滑动
   *
   * @default true
   */
  circular?: boolean;
  /**
   * 是否是纵向滑动
   *
   * @default false
   */
  vertical?: boolean;
  /**
   * 前一项露出边距
   *
   * 默认为 0px，接受 px 和 rpx 值
   */
  preMargin?: string;
  /**
   * 后一项露出边距
   *
   * 默认为 0px，接受 px 和 rpx 值
   */
  nextMargin?: string;
  /** swiper 改变时触发的函数名称 */
  change?: string;
  /** swiper 动画结束时触发的函数名称 */
  animation?: string;
  /**
   * swiper 中图片的类名
   *
   * 默认样式为 'width:100%!important;height:100%!important;'
   */
  imgClass?: string;
  /** 图片的显示模式 */
  imgMode?: ImageMode;
}
