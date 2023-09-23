import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { type PageOptions } from "../components/typings.js";
import { getFileList, getWordNumber } from "../utils/index.js";

export const getJSONValue = (content: unknown): string => {
  if (typeof content === "number") return content.toString();
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    if (Array.isArray(content)) return content.map(getJSONValue).join(" ");
    else if (content) {
      let result = "";

      for (const key in content)
        result += ` ${getJSONValue((content as Record<string, unknown>)[key])}`;

      return result;
    }
  }

  return "";
};

export const getWords = (path: string): number => {
  let words = 0;

  getFileList(path, ".json").forEach((filePath) => {
    const pageContent = <PageOptions>JSON.parse(
      readFileSync(resolve(path, filePath), {
        encoding: "utf-8",
      }),
    );

    const content = getJSONValue(pageContent);

    words += getWordNumber(content);
  });

  return words;
};

export const count = (): void => {
  const apartmentWords = getWords("./d/apartment");
  const functionWords = getWords("./d/function");
  const guideWords = getWords("./d/guide");
  const introWords = getWords("./d/intro");
  const otherWords = getWords("./d/other");
  const newcomerWords = getWords("./d/newcomer");
  const schoolWords = getWords("./d/school");
  const wordsTip = `现有字数为 ${
    apartmentWords +
    functionWords +
    guideWords +
    introWords +
    otherWords +
    newcomerWords +
    schoolWords
  } 字，其中东师指南部分 ${guideWords} 字，新生迎新部分 ${newcomerWords} 字，东师介绍部分 ${introWords} 字，机构介绍部分 ${apartmentWords} 字，学院介绍部分 ${schoolWords} 字，功能大厅部分 ${functionWords} 字，其他部分 ${otherWords} 字。`;

  console.log(wordsTip);

  getFileList("./config", ".yml").forEach((filePath) => {
    if (/\/(?:about|settings)\.yml$/u.exec(filePath)) {
      const content = readFileSync(resolve("./config/", filePath), {
        encoding: "utf-8",
      });
      const newContent = content.replace(
        /现有字数为.*?其他部分.*?字。/u,
        wordsTip,
      );

      writeFileSync(resolve("./config/", filePath), newContent);
    }

    const content = readFileSync("./pages/other/guide/index.yml", {
      encoding: "utf-8",
    });
    const newContent = content.replace(
      /现有字数为.*?其他部分.*?字。/u,
      wordsTip,
    );

    writeFileSync("./pages/other/guide/index.yml", newContent);
  });
};
