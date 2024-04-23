import type { BaseComponentOptions } from "../common.js";

export interface BaseListComponentItemOptions extends BaseComponentOptions {
  /** 列表单元的显示文字 */
  text: string;
  /** 列表图标的本地路径或在线网址 */
  icon?: string;
  /** 列表内容的描述 */
  desc?: string;
  /**
   * 隐藏该列表项
   *
   * @default false
   */
  hidden?: boolean;
}

export interface ListComponentItemOptions extends BaseListComponentItemOptions {
  /** 对应界面的文件路径 */
  path?: string;
  /** 列表指向的界面路径或短名称 */
  url?: string;
}

export interface ListComponentOptions extends BaseComponentOptions {
  tag: "list";
  /** 列表标题 */
  header?: string | false;
  /** 列表内容 */
  items: ListComponentItemOptions[];
  /** 列表页脚 */
  footer?: string;
}

export interface NavigatorListComponentItemOptions
  extends BaseListComponentItemOptions {
  type: "navigator";
  /** 小程序提供的开放能力 */
  openType?:
    | "navigate"
    | "redirect"
    | "switchTab"
    | "reLaunch"
    | "navigateBack"
    | "exit";
  /** 跳转目标 */
  target?: "self" | "miniProgram";
  /** 跳转到的 url */
  url?: string;
}

export interface SwitchListComponentItemOptions
  extends BaseListComponentItemOptions {
  type: "switch";
  /** 所控变量在 storage 中的 key 值 */
  key: string;
  /**
   * 开关对应的函数名称
   *
   * 不填仅改变 storage 中 key 的值
   */
  handler?: string;
  /** 开关颜色 */
  color?: string;
}

export interface SliderListComponentItemOptions
  extends BaseListComponentItemOptions {
  type: "slider";
  /** 滑块所控变量在 storage 中的 key 值 */
  key: string;
  /** 滑块对应的函数名称 */
  handler?: string;
  /**
   * 滑块的最小值
   *
   * @default 0
   */
  min?: number;
  /**
   * 滑块的最大值
   *
   * @default 100
   */
  max?: number;
  /**
   * 滑块的步长
   *
   * @default 1
   */
  step?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PickerListComponentItemOptions<T = any>
  extends BaseListComponentItemOptions {
  type: "picker";
  /** 选择器中包含的值 */
  select: T[];

  /** 选择器所改变的变量在本地存储中的名称 */
  key: string;
  /**
   * picker 选择器对应的函数名称
   *
   * 不填仅改变界面显示值与 storage 中 key 的值
   */
  handler?: string;

  /**
   * 设置 true 时为单列选择器
   *
   * 默认为多列选择器
   */
  single?: boolean;
  /**
   * 默认为弹出式 picker
   *
   * 设置 `true` 时为嵌入式 picker
   */
  inlay?: boolean;
  /** picker 选择器对应的值 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: T;
}

export interface ButtonListComponentItemOptions
  extends BaseListComponentItemOptions {
  type: "button";
  /**
   * 按钮函数名
   *
   * 填入按钮点击后触发的函数名
   */
  handler?: string;
  /**
   * 按钮的开放能力
   */
  openType?:
    | "contact"
    | "share"
    | "launchApp"
    | "openSetting"
    | "feedback"
    // 微信
    | "getPhoneNumber"
    // QQ
    | "openGroupProfile"
    | "addFriend"
    | "addColorSign"
    | "openPublicProfile"
    | "addGroupApp"
    | "shareMessageToFriend"
    | "addToFavorites";

  /** 添加好友开放能力 */
  openId?: string;
  /** 打开群资料卡片开放能力 */
  groupId?: string;
}

export type FunctionalListComponentItemOptions =
  | ListComponentItemOptions
  | NavigatorListComponentItemOptions
  | SwitchListComponentItemOptions
  | PickerListComponentItemOptions
  | SliderListComponentItemOptions
  | ButtonListComponentItemOptions;

export interface FunctionalListComponentOptions extends BaseComponentOptions {
  tag: "functional-list";
  /** 列表标题 */
  header?: string | false;
  /** 列表内容 */
  items: FunctionalListComponentItemOptions[];
  /** 列表页脚 */
  footer?: string;
}
