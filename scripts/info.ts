import { config } from "dotenv";

config();

export const appIDInfo = <Record<string, string>>{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "1109559721": process.env.QQ_API_KEY,
  wx33acb831ee1831a5: process.env.WECHAT_API_KEY,
  wx9ce37d9662499df3: process.env.OFFICIAL_API_KEY,
};
