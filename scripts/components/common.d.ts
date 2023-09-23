export type ImageMode =
  | "widthFix"
  | "scaleToFill"
  | "aspectFit"
  | "aspectFill"
  | "top"
  | "bottom"
  | "center"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";

export interface BaseComponentOptions {
  /** 显示的环境 */
  env?: string[];
}
