import { appIDInfo } from "../info.js";

export const getWechatAccessToken = (appid: string): Promise<string> =>
  fetch(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appIDInfo[appid]}`,
  )
    .then((res) => res.json() as Promise<{ access_token: string }>)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .then(({ access_token }) => access_token);
