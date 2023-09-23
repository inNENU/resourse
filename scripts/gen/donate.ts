import { basename } from "node:path";

import { resolvePage } from "../components/page.js";
import { type PageConfig, type PageOptions } from "../components/typings.js";

export interface Donate {
  all: number;
  donations: [string, number][];
}

export const genDonate = (data: Donate, filePath: string): PageOptions => {
  const baseName = basename(filePath);

  const donateAmount = data.donations.reduce(
    (prev, current) => prev + current[1],
    0,
  );

  const bestData = data.donations
    .filter((item) => item[1] >= 50)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]}: ￥${item[1]}`);
  const goldData = data.donations
    .filter((item) => item[1] < 50 && item[1] >= 10)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]}: ￥${item[1]}`);
  const outstandingData = data.donations
    .filter((item) => item[1] < 10 && item[1] > 2)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]}: ￥${item[1]}`);
  const goodData = data.donations
    .filter((item) => item[1] <= 2)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]}`);

  const pageData: PageConfig = {
    title: `${baseName}年感谢名单`,
    desc: "该页面为手动更新，会出现延迟",
    author: "Mr.Hope",
    id: `other/donate/${baseName}`,
    content: [
      {
        tag: "text",
        type: "info",
        text: [
          "您的支持是 Mr.Hope 的不断动力，Mr.Hope 在此表示对大家由衷的感谢!",
        ],
      },
      {
        tag: "ul",
        heading: "年度统计",
        text: [
          `总支出: ${data.all}元`,
          `总支持: ${donateAmount.toFixed(2)}元`,
          `结余: ${(donateAmount - data.all).toFixed(2)}元`,
        ],
      },
      {
        tag: "title",
        text: "最佳支持者 (￥50+)",
      },
      bestData.length
        ? {
            tag: "ol",
            text: bestData,
            style: "font-size: 18px",
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
      {
        tag: "title",
        text: "金牌支持者 (￥10+)",
      },
      goldData.length
        ? {
            tag: "ol",
            text: goldData,
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
      {
        tag: "title",
        text: "杰出支持者 (￥2+)",
      },
      outstandingData.length
        ? {
            tag: "ol",
            text: outstandingData,
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
      {
        tag: "title",
        text: "优秀支持者",
      },
      goodData.length
        ? {
            tag: "ol",
            text: goodData,
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
    ],
  };

  return resolvePage(pageData);
};
