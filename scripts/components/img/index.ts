import { basename } from "node:path";

import { checkKeys } from "@mr-hope/assert-type";

import { type ImageComponentOptions } from "./typings.js";
import { aliasResolve } from "../utils.js";

export const resolveImg = (
  element: ImageComponentOptions,
  location = "",
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = aliasResolve(element.src, "Image", location);

  checkKeys(
    element,
    {
      tag: "string",
      src: "string",
      res: ["string", "undefined"],
      desc: ["string", "undefined"],
      lazy: ["boolean", "undefined"],
      watermark: ["boolean", "undefined"],
      imgMode: {
        type: ["string", "undefined"],
        enum: [
          "widthFix",
          "scaleToFill",
          "aspectFit",
          "aspectFill",
          "top",
          "bottom",
          "center",
          "left",
          "right",
          "top left",
          "top right",
          "bottom left",
          "bottom right",
          undefined,
        ],
      },
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getImgMarkdown = (element: ImageComponentOptions): string => {
  // `$` alias resolve and file check
  if (element.src) element.src = aliasResolve(element.src);

  const { src, desc } = element;

  return `\
<figure>
  <img src="${src}" alt="${desc || basename(src).replace(/\..+$/, "")}" />
  ${desc ? `<figcaption>${desc}</figcaption>` : ""}
</figure>

`;
};
