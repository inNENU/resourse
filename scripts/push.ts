import { appIDInfo } from "./info.js";
import { getFileList } from "./utils/index.js";

const appidList = Object.keys(appIDInfo);

export const pushPages = (): Promise<void> => {
  const fileList = [
    ...getFileList("./pages/guide", "yml").map(
      (filePath) =>
        `G${filePath.replace(/\.yml$/u, "").replace(/\/index$/, "/")}`,
    ),
    ...getFileList("./pages/intro", "yml").map(
      (filePath) =>
        `I${filePath.replace(/\.yml$/u, "").replace(/\/index$/, "/")}`,
    ),
  ];

  const pageLists = fileList.map((filePath) => ({
    page: "pages/info/info",
    query: `path=${filePath}`,
  }));

  const promises = appidList.map((appid) =>
    Number.isNaN(Number(appid))
      ? fetch(
          `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appIDInfo[appid]}`,
        )
          // eslint-disable-next-line @typescript-eslint/naming-convention
          .then((res) => res.json() as Promise<{ access_token: string }>)
          .then((data) =>
            fetch(
              `https://api.weixin.qq.com/wxa/search/wxaapi_submitpages?access_token=${data.access_token}`,
              { method: "post", body: JSON.stringify({ pages: pageLists }) },
            ),
          )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          })
      : Promise.resolve(),
  );

  return Promise.all(promises).then(() => {
    console.log("All pages are published");
  });
};

await pushPages();
