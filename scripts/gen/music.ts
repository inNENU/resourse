import { resolveAlias } from "../components/utils.js";

export interface MusicInfo {
  src: string;
  cover: string;
  title: string;
  singer: string;
  lyric?: string;
}

export const checkMusic = (
  data: MusicInfo[],
  location: string,
): MusicInfo[] => {
  data.forEach((item) => {
    // `$` alias resolve and file check
    if (item.cover) item.cover = resolveAlias(item.cover, "Image", location);
    if (item.src) item.src = resolveAlias(item.src, "File", location);
  });

  return data;
};
