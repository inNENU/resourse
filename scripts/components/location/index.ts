import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import type { LocationComponentOptions } from "./typings.js";
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
      loc: "string",
      name: ["string", "undefined"],
      detail: ["string", "undefined"],
      path: ["string", "undefined"],
    });

    if (item.loc) {
      const [latitude, longitude] = item.loc.split(",").map(Number);

      // @ts-expect-error: Backward compatibility
      item.latitude = latitude;
      // @ts-expect-error: Backward compatibility
      item.longitude = longitude;
    }

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
      ({ loc, name = "位置", detail = "详情" }) =>
        `coord:${loc};title:${encodeURIComponent(
          name,
        )};addr:${encodeURIComponent(detail)}`,
    )
    .join(
      "|",
    )}&key=NLVBZ-PGJRQ-T7K5F-GQ54N-GIXDH-FCBC4&referer=inNENU" frameborder="0" width="100%" height="320px" />

`;
};
