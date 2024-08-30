import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

import { deleteSync } from "del";
import { getFileList, getPageMarkdown } from "innenu-generator";
import type { PageConfig } from "innenu-generator/typings";
import { load } from "js-yaml";

// 删除旧的文件
deleteSync([
  "./site/**",
  "!./site/.vuepress/**",
  "!./site/README.md",
  "!./site/about/**",
  "!./site/contributing/**",
  "!./site/tool/**",
]);

// 生成对应的 Markdown

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertYml2Md = <T = any>(
  sourceFolder: string,
  targetFolder: string,
  convertFunction: (data: T, filePath: string) => string,
  dir = "",
): void => {
  const fileList = getFileList(sourceFolder, "yml");

  fileList.forEach((filePath) => {
    const folderPath = dirname(resolve(targetFolder, filePath));

    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

    const content = readFileSync(resolve(sourceFolder, filePath), {
      encoding: "utf-8",
    });
    const json = load(content) as T;

    writeFileSync(
      resolve(
        targetFolder,
        filePath
          .replace(/\.yml/u, ".md")
          .replace(/(\/|^)index.md$/, "$1README.md"),
      ),

      convertFunction(
        json,
        relative("./", resolve(dir, filePath.replace(/\.yml/u, ""))).replace(
          /\\/gu,
          "/",
        ),
      ),

      { encoding: "utf-8" },
    );
  });
};

["apartment", "school", "newcomer", "intro", "guide", "other"].forEach(
  (folder) => {
    convertYml2Md(`./pages/${folder}`, `./site/${folder}`, (data: PageConfig) =>
      getPageMarkdown(data),
    );
  },
);
