import { checkKeys } from "@mr-hope/assert-type";

import { type VideoComponentOptions } from "./typings.js";
import { resolveAlias } from "../utils.js";

export const resolveVideo = (
  element: VideoComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = resolveAlias(element.src, "File", location);

  checkKeys(
    element,
    {
      tag: "string",
      src: "string",
      loop: ["boolean", "undefined"],
      controls: ["boolean", "undefined"],
      title: ["string", "undefined"],
      poster: ["string", "undefined"],
      autoplay: ["boolean", "undefined"],
      startTime: ["number", "undefined"],
      danmuBtn: ["boolean", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  if (element.danmuList) {
    element.danmuList.forEach((item) => {
      checkKeys(item, {
        text: ["string", "undefined"],
        color: ["string", "undefined"],
        time: ["number", "undefined"],
      });
    });
  }
};

export const getVideoMarkdown = (component: VideoComponentOptions): string => {
  // `$` alias resolve and file check
  component.src = resolveAlias(component.src);

  const { src, poster, title } = component;

  return `\
<VidStack src="${src}"${title ? ` title="${title}"` : ""}${
    poster ? ` poster="${poster}"` : ""
  } />

`;
};
