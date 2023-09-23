import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import { LocationComponentOptions } from "./typings.js";
import { resolvePath } from "../utils.js";

export const resolveLocation = (
  component: LocationComponentOptions,
  location = "",
): void => {
  checkKeys(
    component,
    {
      tag: "string",
      title: "string",
      points: "object[]",
      navigate: ["boolean", "undefined"],
    },
    location,
  );

  component.points.forEach((item) => {
    checkKeys(item, {
      latitude: "number",
      longitude: "number",
      name: ["string", "undefined"],
      detail: ["string", "undefined"],
      path: ["string", "undefined"],
    });

    if (item.path) {
      const path = resolvePath(item.path);

      if (!existsSync(`./data/function/map/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);
    }
  });
};

export const getLocationMarkdown = (
  component: LocationComponentOptions,
): string => {
  const { title, points = [] } = component;

  return `\
${
  title
    ? `\
#### ${title}

`
    : ""
}\
<iframe class="location-iframe" src="https://apis.map.qq.com/tools/poimarker?type=0&marker=${points
    // maximum 4 points
    .slice(0, 4)
    .map(
      ({ latitude, longitude, name = "位置", detail = "详情" }) =>
        `coord:${latitude},${longitude};title:${encodeURIComponent(
          name,
        )};addr:${encodeURIComponent(detail)}`,
    )
    .join(
      "|",
    )}&key=YNUBZ-AN3HF-P62JK-J2GND-XQTQQ-TTBOB&referer=in东师" frameborder="0" width="100%" height="320px" />

`;
};
