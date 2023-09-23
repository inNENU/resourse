import { execSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { type } from "node:os";

import { deleteSync } from "del";

export const zipFile = (folderLocation: string, folderName: string): void => {
  /** 文件名 */

  deleteSync(`./temp/${folderName}.zip`);

  // 压缩文件
  if (type() === "Linux")
    execSync(
      `zip -r ${folderLocation}/${folderName}.zip ${folderLocation}/${folderName}}`,
    );
  else if (type() === "Windows_NT") {
    execSync(
      `cd ./${folderLocation} && "../assets/lib/7za" a -r ${folderName}.zip ${`"${folderName}/"`} && cd ..`,
    );
  } else throw new Error("Mac OS is not supported");
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
  /** 资源列表 */
  /** 差异列表 */
  const diffResult = execSync("git status -s").toString();

  /** 版本信息 */
  const versionInfo = existsSync("./d/version.json")
    ? <{ version: Record<string, number>; size: Record<string, number> }>(
        JSON.parse(readFileSync("./d/version.json", { encoding: "utf-8" }))
      )
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
        .some((item) => item.substring(3).startsWith(`d/${name}/`)) ||
      !existsSync(`./d/${name}.zip`)
    ) {
      // 更新版本号
      updateList.push(name);
      versionInfo.version[name] += 1;

      // 压缩文件
      zipFile("d", name);
      versionInfo.size[name] = Math.round(
        statSync(`./d/${name}.zip`).size / 1024,
      );
    }
  });

  // 写入版本信息
  writeFileSync("./d/version.json", JSON.stringify(versionInfo), {
    encoding: "utf-8",
  });
  writeFileSync("./d/oss-update", updateList.join("\n"), {
    encoding: "utf-8",
  });
};
