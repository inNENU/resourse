import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import OSS from "ali-oss";
import { config } from "dotenv";

config();

const __dirname = path.dirname(
  path.join(fileURLToPath(import.meta.url), "../"),
);

const syncOSS = async (): Promise<void> => {
  const finalDiffResult = execSync("git status").toString();
  const updateZipFileInfo = readFileSync("./d/oss-update", {
    encoding: "utf-8",
  });
  const updateZipFiles = updateZipFileInfo.split("\n").filter((item) => item);
  const assetsFiles = finalDiffResult.split("\n").map((item) => {
    const line = item.trim();
    const isDeleted = line.startsWith("deleted:");

    if (isDeleted)
      return {
        type: "deleted",
        remove: /deleted:\s*(\S*)$/.exec(line)?.[1],
      };

    const isRenamed = line.startsWith("renamed:");

    if (isRenamed) {
      const [, remove, add] = /renamed:\s+(\S*)\s+->\s+(\S*)$/.exec(line)!;

      return {
        type: "renamed",
        remove,
        add,
      };
    }

    const isAdded = item.trim().startsWith("new file:");

    if (isAdded)
      return {
        type: "added",
        add: /new file:\s+(\S*)$/.exec(item)?.[1],
      };

    const isModified = item.trim().startsWith("modified:");

    if (isModified)
      return {
        type: "modified",
        add: /modified:\s*(\S*)$/.exec(item)?.[1],
      };

    return null;
  });

  console.log(assetsFiles);

  const addedFiles = assetsFiles
    .filter(
      (item): item is { type: string; add: string } =>
        item !== null &&
        Boolean(item.add?.startsWith("img/") || item.add?.startsWith("file/")),
    )
    .map((item) => item.add);
  const deletedFiles = assetsFiles
    .filter(
      (item): item is { type: string; remove: string } =>
        item !== null &&
        Boolean(
          item.remove?.startsWith("img/") || item.remove?.startsWith("file/"),
        ),
    )
    .map((item) => item.remove);
  const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: process.env.OSS_KEY_ID!,
    accessKeySecret: process.env.OSS_KEY_SECRET!,
    bucket: "innenu",
    secure: true,
  });

  const headers = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "x-oss-storage-class": "Standard",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "x-oss-object-acl": "private",
  };

  const putFile = async (filePath: string): Promise<void> => {
    try {
      console.log(`Putting file ${filePath}`);
      const result = await client.put(
        filePath,
        path.normalize(path.join(__dirname, filePath)),
        { headers },
      );

      if (result.res.status !== 200)
        console.log(`${filePath} upload failed:`, result.res.status);
    } catch (err) {
      console.error(`${filePath} upload failed:`, err);
    }
  };

  const deleteFiles = async (filePaths: string[]): Promise<void> => {
    try {
      if (filePaths.length === 0) return;

      const result = await client.deleteMulti(filePaths);

      if (result.res.status !== 200)
        console.log(`delete failed:`, result.res.status);
    } catch (err) {
      console.error(`delete failed:`, err);
    }
  };

  await Promise.all([
    ...updateZipFiles.map((item) => putFile(`d/${item}.zip`)),
    ...addedFiles.map((item) => putFile(item)),
    deleteFiles(deletedFiles),
  ]);
};

await syncOSS();
