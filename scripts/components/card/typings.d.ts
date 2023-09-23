import { type BaseComponentOptions } from "../common.js";

export interface MiniprogramCardOptions extends BaseComponentOptions {
  tag: "card";
  /** 封面图片在线地址 */
  cover?: string;
  /** 卡片标题 */
  title: string;
  /** 卡片描述 */
  desc?: string;

  /** 卡片 Logo 地址 */
  logo?: string;
  /** 卡片 Logo 名称 */
  name?: string;

  /** 小程序选项 */
  options: {
    /** 要打开的小程序 appId */
    appId: string;
    /** 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
     *
     * 可选值:
     * - 'develop': 开发版;
     * - 'trial': 体验版;
     * - 'release': 正式版; */
    envVersion?: "develop" | "trial" | "release";
    /** 需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch`，`App.onShow` 中获取到这份数据。如果跳转的是小游戏，可以在 [wx.onShow](#)、[wx.getLaunchOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html) 中可以获取到这份数据数据。 */
    extraData?: Record<string, unknown>;
    /** 打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 `App.onLaunch`、`App.onShow` 和 `Page.onLoad` 的回调函数或小游戏的 [wx.onShow](#) 回调函数、[wx.getLaunchOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html) 中可以获取到 query 数据。对于小游戏，可以只传入 query 部分，来实现传参效果，如:传入 "?foo=bar"。 */
    path?: string;
    /** 需要基础库: `2.18.1`
     *
     * 小程序链接，当传递该参数后，可以不传 appId 和 path。链接可以通过【小程序菜单】->【复制链接】获取。 */
    shortLink?: string;
  };
}

export interface NormalCardComponentOptions extends BaseComponentOptions {
  tag: "card";
  /** 跳转的链接 */
  url: string;

  /** 封面图片在线地址 */
  cover?: string;
  /** 卡片标题 */
  title: string;
  /** 卡片描述 */
  desc?: string;
  /** 卡片 Logo 地址 */
  logo?: string;
  /** 卡片 Logo 名称 */
  name?: string;
}

export interface PageCardComponentOptions extends BaseComponentOptions {
  tag: "card";
  /** 跳转的文件名称 */
  path: string;
  /** 封面图片在线地址 */
  cover?: string;
  /** 卡片标题 */
  title: string;
  /** 卡片描述 */
  desc?: string;
  /** 卡片 Logo 地址 */
  logo?: string;
  /** 卡片 Logo 名称 */
  name?: string;
}

export type CardComponentOptions =
  | MiniprogramCardOptions
  | NormalCardComponentOptions
  | PageCardComponentOptions;
