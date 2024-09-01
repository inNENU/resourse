import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { type } from "node:os";

import type { ResourceVersionInfo } from "innenu-generator";

export const RESOURCE_NAMES = [
  "apartment",
  "function",
  "guide",
  "icon",
  "intro",
  "newcomer",
  "school",
];

export const RESOURCE_FOLDERS = [
  "apartment",
  "guide",
  "intro",
  "newcomer",
  "school",
  "other",
];

const DEFAULT_VERSION_INFO: ResourceVersionInfo = {
  version: {
    apartment: 0,
    function: 0,
    guide: 0,
    intro: 0,
    icon: 0,
    newcomer: 0,
    school: 0,
  },
  size: {},
};

export const zipFile = (folderName: string): void => {
  const os = type();

  /** 文件名 */
  try {
    rmSync(`./oss/${folderName}.zip`);
  } catch {
    // do nothing
  }

  // 压缩文件
  if (os === "Linux" || os === "Darwin") {
    execSync(`zip -r ./.resource/${folderName}.zip ./.resource/${folderName}`);
    execSync(`mv .resource/${folderName}.zip .oss/`);
  } else if (os === "Windows_NT") {
    execSync(
      `cd ./.resource && "../assets/lib/7za" a -r ${folderName}.zip "${folderName}/" && cd ..`,
    );
    execSync(`move .resource\\${folderName}.zip .oss\\`);
  }
};

export const getUpdatedResourceNames = (diffFiles: string[]): string[] =>
  RESOURCE_NAMES.filter((name) =>
    diffFiles.some((item) =>
      ["function", "icon"].includes(name)
        ? item.startsWith(`data/${name}`)
        : item.startsWith(`pages/${name}/`),
    ),
  );

export const generateResource = (diffFiles: string[]): void => {
  if (!existsSync("./.oss")) mkdirSync("./.oss");

  /** 版本信息 */
  const versionInfo = existsSync("./data/version.json")
    ? (JSON.parse(
        readFileSync("./data/version.json", { encoding: "utf-8" }),
      ) as ResourceVersionInfo)
    : DEFAULT_VERSION_INFO;

  const updatedResourceNames = getUpdatedResourceNames(diffFiles);

  RESOURCE_NAMES.forEach((name) => {
    if (
      !existsSync(`./.oss/${name}.zip`) ||
      updatedResourceNames.includes(name)
    )
      zipFile(name);

    if (updatedResourceNames.includes(name)) {
      // 更新版本号与尺寸
      versionInfo.version[name] += 1;
      versionInfo.size[name] = Math.round(
        statSync(`./.oss/${name}.zip`).size / 1024,
      );
    }
  });

  // 写入版本信息
  writeFileSync(
    "./data/version.json",
    `${JSON.stringify(versionInfo, null, 2)}\n`,
    { encoding: "utf-8" },
  );
  writeFileSync("./.resource/version.json", JSON.stringify(versionInfo), {
    encoding: "utf-8",
  });
};
