export interface PEConfig {
  /** 肺活量 */
  vitalCapacity: number[];
  /** 短跑 */
  shortRun: number[];
  /** 坐位体前屈 */
  sitAndReach: number[];
  /** 立定跳远 */
  standingLongJump: number[];
  /** 仰卧起坐 */
  situp?: number[];
  /** 引体向上 */
  chinning?: (number | string)[];
  /** 长跑 */
  longRun: string[] | number[];
}

export const genPEScore = (config: PEConfig): PEConfig => {
  /*
   * 读取相应配置文件
   * 转换长跑时间
   */
  config.longRun = config.longRun.map((element) => {
    const time = element.toString().split(":");

    return Number(time[0]) * 60 + Number(time[1]);
  });

  // 转换立定跳远单位
  config.standingLongJump = config.standingLongJump.map(
    (element) => element / 100,
  );

  return config;
};
