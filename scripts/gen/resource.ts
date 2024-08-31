import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { type } from "node:os";

import { deleteSync } from "del";

export const zipFile = (folderName: string): void => {
  /** 文件名 */
  deleteSync(`./oss/${folderName}.zip`);

  // 压缩文件
  if (type() === "Linux" || type() === "Darwin") {
    execSync(`zip -r ./.resource/${folderName}.zip ./.resource/${folderName}`);
    execSync(`mv .resource/${folderName}.zip .oss/`);
  } else if (type() === "Windows_NT") {
    execSync(
      `cd ./.resource && "../assets/lib/7za" a -r ${folderName}.zip "${folderName}/" && cd ..`,
    );
    execSync(`move .resource\\${folderName}.zip .oss\\`);
  }
};

export const resourceList = [
  "apartment",
  "school",
  "function",
  "guide",
  "icon",
  "intro",
  "newcomer",
];

export const generateResource = (): void => {
  if (!existsSync("./.oss")) mkdirSync("./.oss");

  /** 差异列表 */
  const diffResult = execSync("git status -s").toString();

  /** 版本信息 */
  const versionInfo = existsSync("./data/version.json")
    ? (JSON.parse(
        readFileSync("./data/version.json", { encoding: "utf-8" }),
      ) as {
        version: Record<string, number>;
        size: Record<string, number>;
      })
    : {
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
  /** 更新列表 */
  const updateList: string[] = [];

  resourceList.forEach((name) => {
    if (
      diffResult
        .split("\n")
        .some((item) => item.substring(3).startsWith(`.resource/${name}/`)) ||
      !existsSync(`./.oss/${name}.zip`)
    ) {
      // 更新版本号
      updateList.push(name);
      versionInfo.version[name] += 1;

      // 压缩文件
      zipFile(name);
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
  writeFileSync("./.oss/oss-update", updateList.join("\n"), {
    encoding: "utf-8",
  });
};
