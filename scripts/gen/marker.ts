import { existsSync } from "node:fs";

import { type Marker, type MarkerConfig, type MarkerData } from "./typings.js";

/**
 * 处理 marker
 *
 * @param marker 待处理的 Marker
 *
 * @returns 处理后的marker
 */
const genMarker = (
  marker: Marker,
  folder: string,
  category: string,
  id: number,
): MarkerData => {
  const markerData = {
    id,
    ...marker,
  };

  if (marker.path) {
    const path = `${category}/${marker.path}`;

    if (!existsSync(`./data/function/map/${folder}/${path}.yml`))
      console.error(`location ${path} not exist in ${folder}`);

    markerData.path = `${category}/${marker.path}`;
  }

  return markerData;
};

export interface MarkerOption {
  [props: string]: {
    /** 分类名称 */
    name: string;
    content: Marker[];
  };
}

/**
 * 设置Marker
 *
 * @param data marker数据
 * @param name marker名称
 */
export const resolveMarker = (
  data: MarkerOption,
  folder: string,
): MarkerConfig => {
  const categories = Object.keys(data);

  const categoryConfig = [
    { path: "all", name: "全部" },
    ...categories.map((category) => ({
      path: category,
      name: data[category].name,
    })),
  ];

  let id = 0;
  const markers = <Record<string, MarkerData[]>>{ all: [] };

  categories.forEach((category) => {
    markers[category] = data[category].content.map((marker) =>
      // eslint-disable-next-line no-plusplus
      genMarker(marker, folder, category, id++),
    );

    markers.all = markers.all.concat(markers[category]);
  });

  return { category: categoryConfig, marker: markers };
};
