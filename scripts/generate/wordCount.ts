import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { getFileList, getJSONWordCount } from "innenu-generator";

const WORD_COUNT_REGEXP = /现有字数为.*?其他部分.*?字。/u;

export const updateWordCount = (): void => {
  const apartmentWords = getJSONWordCount("./.resource/apartment");
  const functionWords = getJSONWordCount("./.resource/function");
  const guideWords = getJSONWordCount("./.resource/guide");
  const introWords = getJSONWordCount("./.resource/intro");
  const otherWords = getJSONWordCount("./.resource/other");
  const newcomerWords = getJSONWordCount("./.resource/newcomer");
  const schoolWords = getJSONWordCount("./.resource/school");
  const allWords =
    apartmentWords +
    functionWords +
    guideWords +
    introWords +
    otherWords +
    newcomerWords +
    schoolWords;

  const wordsTip = `现有字数为 ${allWords} 字，其中东师指南部分 ${guideWords} 字，新生迎新部分 ${newcomerWords} 字，东师介绍部分 ${introWords} 字，机构介绍部分 ${apartmentWords} 字，学院介绍部分 ${schoolWords} 字，功能大厅部分 ${functionWords} 字，其他部分 ${otherWords} 字。`;

  getFileList("./config", ".yml").forEach((filePath) => {
    if (filePath.endsWith("/settings.yml")) {
      const content = readFileSync(resolve("./config/", filePath), {
        encoding: "utf-8",
      });

      writeFileSync(
        resolve("./config/", filePath),
        content.replace(WORD_COUNT_REGEXP, wordsTip),
      );
    }
  });
};
