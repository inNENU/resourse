import { readFileSync } from "node:fs";

import { getFileList } from "../utils/index.js";

const files = new Set(getFileList("file"));

const removeExistingFiles = (folder: string, path: string): void =>
  Array.from(
    readFileSync(`./${folder}/${path}`, { encoding: "utf-8" }).matchAll(
      /\$file\/(.*)$/gm,
    ),
  ).forEach(([, link]) => {
    files.delete(link);
  });

["config", "data", "pages"].forEach((folder) =>
  getFileList(folder, "yml").forEach((path) =>
    removeExistingFiles(folder, path),
  ),
);

console.log("Files not in use:\n");
console.log(
  Array.from(files)
    .filter((link) => !link.includes("original") && !/20\d{2}/.test(link))
    .map((link) => `./file/${link}`)
    .join("\n"),
);
