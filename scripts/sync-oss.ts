import {
  getLastChangedFiles,
  removeOSSFiles,
  uploadOSSFiles,
} from "innenu-generator";

import { getUpdatedResourceNames } from "./generate/resource.js";

import "./config/env.js";

const syncOSS = async (): Promise<void> => {
  const { added, modified, deleted } = getLastChangedFiles();

  const newFiles = [
    ...[...added, ...modified].filter(
      (item) => item.startsWith("img/") || item.startsWith("file/"),
    ),
    ...getUpdatedResourceNames([...added, ...modified, ...deleted]).map(
      (file) => ({
        local: `.oss/${file}.zip`,
        online: `${file}.zip`,
      }),
    ),
  ];

  await Promise.all([
    uploadOSSFiles(newFiles),
    removeOSSFiles(
      deleted.filter(
        (item) => item.startsWith("img/") || item.startsWith("file/"),
      ),
    ),
  ]);
};

await syncOSS();
