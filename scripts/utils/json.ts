import { readFile, readdir } from "node:fs";

const testJSON = (path: string): Promise<void> =>
  new Promise((resolve, reject) => {
    readFile(path, { encoding: "utf-8" }, (err, content) => {
      if (err) {
        console.error(`Read file ${path} failed:`, err);

        return reject(err);
      }
      try {
        JSON.parse(content);
      } catch (err) {
        throw new Error(`${path} is not a correct JSON file`);
      }

      resolve();
    });
  });

export const checkJSON = (path: string): Promise<void> =>
  new Promise((resolve, reject) => {
    readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Read dir ${path} failed:`, err);

        return reject(err);
      }

      const checkProcess: Promise<void>[] = [];

      files.forEach((file) => {
        // 是文件
        if (file.isDirectory())
          checkProcess.push(checkJSON(`${path}/${file.name}`));
        else if (file.name.split(".").pop() === "json")
          checkProcess.push(testJSON(`${path}/${file.name}`));
      });

      Promise.all(checkProcess).then(() => resolve());
    });
  });
