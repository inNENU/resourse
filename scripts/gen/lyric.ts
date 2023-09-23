import { readFileSync, writeFileSync } from "node:fs";

import { getFileList } from "../utils/index.js";

const lyricFolder = "./data/function/music";

/** 歌词配置 */
interface LyricConfig {
  time: number;
  text: string;
}

export const genLyric = (): void => {
  console.log("Generating lyric...");
  const lyricList = getFileList(lyricFolder, ".lrc");

  lyricList.forEach((lyricPath) => {
    const content = readFileSync(`${lyricFolder}/${lyricPath}`, {
      encoding: "utf-8",
    });

    const lyrics = content.split("\n");
    const lyricConfig: LyricConfig[] = [];

    lyrics.forEach((lyric) => {
      const result = /\[(.*)\](.*)?/u.exec(lyric);

      if (result) {
        const timeResult = /(.*):(.*)/u.exec(result[1])!;
        /** 正确的时间 */
        const time = Number(
          (Number(timeResult[1]) * 60 + Number(timeResult[2])).toFixed(3),
        );

        lyricConfig.push({ time, text: result[2] });
      }
    });

    writeFileSync(
      `./d/function/music/${lyricPath.replace(/lrc$/u, "json")}`,
      JSON.stringify(lyricConfig),
    );
  });
  console.log("Generated lyric!");
};
