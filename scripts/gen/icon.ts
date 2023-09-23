import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";

import { getFileList } from "../utils/index.js";

/** SVG 转换 */
export const convertCSSSVG = (content: string): string =>
  `data:image/svg+xml,${content
    .replace(/"/gu, "'")
    .replace(/</gu, "%3C")
    .replace(/>/gu, "%3E")
    .replace(/#/gu, "%23")}`;

const convertBase64SVG = (content: string): string =>
  `data:image/svg+xml;base64,${Buffer.from(
    unescape(encodeURIComponent(content)),
    "utf8",
  ).toString("base64")}`;

export const genIcon = (): void => {
  const fileList = getFileList("./data/icon", "svg");
  const genFileList = getFileList("./d/icon");
  const hintIconData: Record<string, string> = {};
  const weatherIconData: Record<string, string> = {};
  const shareIconData: Record<string, string> = {};

  // remove files
  genFileList.forEach((path) => {
    if (fileList.every((filePath) => !filePath.includes(path)))
      unlinkSync(resolve("./d/icon", path));
  });

  fileList.forEach((filePath) => {
    if (/weather\/hints\//u.exec(filePath)) {
      const svgContent = readFileSync(resolve("./data/icon", filePath), {
        encoding: "utf-8",
      });
      const path = filePath.replace(/weather\/hints\/(.*)\.svg/u, "$1");

      hintIconData[path] = convertBase64SVG(svgContent);
    } else if (/weather\//u.exec(filePath)) {
      const svgContent = readFileSync(resolve("./data/icon", filePath), {
        encoding: "utf-8",
      });
      const path = filePath.replace(/weather\/(.*)\.svg/u, "$1");

      weatherIconData[path] = convertBase64SVG(svgContent);
    } else if (/share\//u.exec(filePath)) {
      const svgContent = readFileSync(resolve("./data/icon", filePath), {
        encoding: "utf-8",
      });
      const path = filePath.replace(/share\/(.*)\.svg/u, "$1");

      shareIconData[path] = convertBase64SVG(svgContent);
    } else {
      const folderPath = dirname(resolve("./d/icon", filePath));

      if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

      const svgContent = readFileSync(resolve("./data/icon", filePath), {
        encoding: "utf-8",
      });

      writeFileSync(
        resolve("./d/icon", filePath.replace(/\.svg$/u, "")),
        convertBase64SVG(svgContent),
        { encoding: "utf-8" },
      );
    }
  });

  // 生成天气图标
  const weatherFolderPath = "./d/icon/weather";

  if (!existsSync(weatherFolderPath))
    mkdirSync(weatherFolderPath, { recursive: true });

  writeFileSync("./d/icon/weather/hint", JSON.stringify(hintIconData), {
    encoding: "utf-8",
  });

  writeFileSync("./d/icon/weather/icon", JSON.stringify(weatherIconData), {
    encoding: "utf-8",
  });

  writeFileSync("./d/icon/shareicons", JSON.stringify(shareIconData), {
    encoding: "utf-8",
  });
};
