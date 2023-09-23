import { aliasResolve } from "../components/utils.js";

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
    if (item.cover) item.cover = aliasResolve(item.cover, "Image", location);
    if (item.src) item.src = aliasResolve(item.src, "File", location);
  });

  return data;
};
