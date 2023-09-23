import { type AccountComponentOptions } from "./account/typings.js";
import { type ActionComponentOptions } from "./action/typings.js";
import { type AudioComponentOptions } from "./audio/typings.js";
import { type CardComponentOptions } from "./card/typings.js";
import { type CarouselComponentOptions } from "./carousel/typings.js";
import { type DocComponentOptions } from "./doc/typings.js";
import { type FooterComponentOptions } from "./footer/typings.js";
import { type GridComponentOptions } from "./grid/typings.js";
import { type ImageComponentOptions } from "./img/typings.js";
import {
  type FunctionalListComponentOptions,
  type ListComponentOptions,
} from "./list/typings.js";
import { type LoadingComponentOptions } from "./loading/typings.js";
import { type LocationComponentOptions } from "./location/typings.js";
import { type PhoneComponentOptions } from "./phone/typings.js";
import { type TableComponentOptions } from "./table/typings.js";
import { type TextComponentOptions } from "./text/typings.js";
import { type TitleComponentOptions } from "./title/typings.js";
import { type VideoComponentOptions } from "./video/typings.js";

export * from "./account/typings.js";
export * from "./action/typings.js";
export * from "./audio/typings.js";
export * from "./card/typings.js";
export * from "./carousel/typings.js";
export * from "./doc/typings.js";
export * from "./footer/typings.js";
export * from "./grid/typings.js";
export * from "./img/typings.js";
export * from "./list/typings.js";
export * from "./location/typings.js";
export * from "./loading/typings.js";
export * from "./phone/typings.js";
export * from "./table/typings.js";
export * from "./text/typings.js";
export * from "./title/typings.js";
export * from "./video/typings.js";

export type PageTag =
  | "account"
  | "action"
  | "audio"
  | "card"
  | "carousel"
  | "doc"
  | "footer"
  | "functional-list"
  | "grid"
  | "img"
  | "list"
  | "table"
  | "title"
  | "text"
  | "phone"
  | "video";

export type ComponentOptions =
  | AccountComponentOptions
  | ActionComponentOptions
  | AudioComponentOptions
  | CarouselComponentOptions
  | CardComponentOptions
  | DocComponentOptions
  | FooterComponentOptions
  | FunctionalListComponentOptions
  | GridComponentOptions
  | ListComponentOptions
  | LocationComponentOptions
  | ImageComponentOptions
  | LoadingComponentOptions
  | PhoneComponentOptions
  | TableComponentOptions
  | TextComponentOptions
  | TitleComponentOptions
  | VideoComponentOptions;

/** 页面配置 */
export interface PageConfig {
  /** 页面标题 */
  title: string;
  /** 页面图标 */
  icon: string;
  /** 页面描述 */
  desc?: string;
  /** 页面作者 */
  author?: string[] | string;
  /** 页面最后更新时间 */
  time?: Date;
  /** 页面标识 */
  id: string;
  /** 是否是灰色背景 */
  grey?: boolean;
  /** 页面内容 */
  content: ComponentOptions[];
  /**
   * 页面引用来源
   */
  cite?: string[] | string;
  /**
   * 页面内容是否已过时
   *
   * @default false
   */
  outdated?: boolean;
  /**
   * 是否可以使用小程序的界面分享
   *
   * @default false
   */
  shareable?: boolean;
  /**
   * 是否可以下载二维码
   *
   * @description Can download when shareable is true
   */
  qrcode?: string | boolean;
  /**
   * 是否在分享弹出菜单中显示联系客服
   *
   * @default true
   */
  contact?: boolean;
  /** 是否隐藏导航栏 */
  hidden?: boolean;
}

/** 页面数据 */
export interface PageOptions {
  /** 页面标题 */
  title: string;
  /** 页面图标 */
  icon: string;
  /** 页面描述 */
  desc?: string;
  /** 页面作者 */
  author?: string;
  /** 页面最后更新时间 */
  time?: string;
  /** 页面标识 */
  id: string;
  /** 是否是灰色背景 */
  grey?: boolean;
  /** 页面内容 */
  content: ComponentOptions[];
  /** 页面图片 */
  images?: string[];
  /**
   * 页面引用来源
   */
  cite?: string[];
  /**
   * 页面内容是否已过时
   *
   * @default false
   */
  outdated?: boolean;
  /**
   * 是否可以使用小程序的界面分享
   *
   * @default false
   */
  shareable?: boolean;
  /**
   * 是否可以下载二维码
   *
   * @description Can download when shareable is true
   */
  qrcode?: string | boolean;
  /**
   * 是否在分享弹出菜单中显示联系客服
   *
   * @default true
   */
  contact?: boolean;
  /** 是否隐藏导航栏 */
  hidden?: boolean;
}
