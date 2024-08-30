import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { getFileList, getJSONWordCount } from "innenu-generator";

export const count = (): void => {
  const apartmentWords = getJSONWordCount("./d/apartment");
  const functionWords = getJSONWordCount("./d/function");
  const guideWords = getJSONWordCount("./d/guide");
  const introWords = getJSONWordCount("./d/intro");
  const otherWords = getJSONWordCount("./d/other");
  const newcomerWords = getJSONWordCount("./d/newcomer");
  const schoolWords = getJSONWordCount("./d/school");
  const wordsTip = `现有字数为 ${
    apartmentWords +
    functionWords +
    guideWords +
    introWords +
    otherWords +
    newcomerWords +
    schoolWords
  } 字，其中东师指南部分 ${guideWords} 字，新生迎新部分 ${newcomerWords} 字，东师介绍部分 ${introWords} 字，机构介绍部分 ${apartmentWords} 字，学院介绍部分 ${schoolWords} 字，功能大厅部分 ${functionWords} 字，其他部分 ${otherWords} 字。`;

  console.info(wordsTip);

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
