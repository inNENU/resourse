import { type BaseComponentOptions } from "../common.js";

export interface PhoneComponentOptions extends BaseComponentOptions {
  tag: "phone";
  /** 标题 */
  header?: string;
  /** 联系人电话号码 */
  num: string;
  /** 联系人的名 */
  fName: string;
  /** 联系人的姓 */
  lName?: string;
  /** 联系人所在公司 */
  org?: string;
  /** 联系人的备注 */
  remark?: string;
  /** 联系人的工作电话 */
  workNum?: string;
  /** 联系人的昵称 */
  nick?: string;
  /** 联系人头像图片路径(仅限本地路径) */
  avatar?: string;
  /** 联系人的微信号 */
  wechat?: string;
  /** 联系人的地址省份 */
  province?: string;
  /** 联系人的地址城市 */
  city?: string;
  /** 联系人的地址街道 */
  street?: string;
  /** 联系人的地址邮政编码 */
  postCode?: string;
  /** 联系人的职位 */
  title?: string;
  /** 联系人的公司电话 */
  hostNum?: string;
  /** 联系人的网站 */
  site?: string;
  /** 联系人的电子邮件 */
  mail?: string;
  /** 联系人的住宅电话 */
  homeNum?: string;
}
