import { readFileSync } from "node:fs";

import { getFileList } from "../utils/index.js";

const images = new Set(
  getFileList("img").filter((link) => !link.endsWith(".drawio")),
);

const ignoreImages = [
  "donate/Alipay.jpg",
  "donate/Wechat.jpg",
  "map/benbuMap.jpg",
  "map/jingyueMap.jpg",
  // TODO: Update image name
  "404pic.jpg",
];

ignoreImages.forEach((image) => images.delete(image));

const removeExistingImages = (folder: string, path: string): void =>
  Array.from(
    readFileSync(`./${folder}/${path}`, { encoding: "utf-8" }).matchAll(
      /\$img\/(.*)$/gm,
    ),
  ).forEach(([, link]) => {
    images.delete(link);
  });

["config", "data", "pages"].forEach((folder) =>
  getFileList(folder, "yml").forEach((path) =>
    removeExistingImages(folder, path),
  ),
);

console.log(images);
