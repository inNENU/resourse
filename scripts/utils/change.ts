import { readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { getFileList } from "./file.js";

export const convertFolder = (
  sourceFolder: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertFunction: (data: string, filePath: string) => any = (data): string =>
    data,
  dir = "",
): void => {
  const fileList = getFileList(sourceFolder, "yml");

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(sourceFolder, filePath), {
      encoding: "utf-8",
    });

    writeFileSync(
      resolve(sourceFolder, filePath),
      convertFunction(
        content,
        relative("./", resolve(dir, filePath.replace(/\.yml/u, ""))).replace(
          /\\/gu,
          "/",
        ),
      ) as string,
      { encoding: "utf-8" },
    );
  });
};
