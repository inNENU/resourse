import { checkKeys } from "@mr-hope/assert-type";

import type { AudioComponentOptions } from "./typings.js";
import { resolveAlias } from "../utils.js";

export const resolveAudio = (
  element: AudioComponentOptions,
  location = "",
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = resolveAlias(element.src, "File", location);

  checkKeys(
    element,
    {
      tag: "string",
      src: "string",
      name: ["string", "undefined"],
      author: ["string", "undefined"],
      poster: ["string", "undefined"],
      autoplay: ["boolean", "undefined"],
      loop: ["boolean", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getAudioMarkdown = (component: AudioComponentOptions): string => {
  // `$` alias resolve and file check
  component.src = resolveAlias(component.src);

  const { src, name, author } = component;

  return `\
<VidStack src="${src}" title="${name ? `名称: ${name}` : ""} ${
    author ? `作者: ${author}` : ""
  }" />

`;
};
