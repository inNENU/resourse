import { checkKeys } from "@mr-hope/assert-type";

import { type AudioComponentOptions } from "./typings.js";
import { aliasResolve } from "../utils.js";

export const resolveAudio = (
  element: AudioComponentOptions,
  location = "",
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = aliasResolve(element.src, "File", location);

  checkKeys(
    element,
    {
      tag: "string",
      src: "string",
      loop: ["boolean", "undefined"],
      controls: ["boolean", "undefined"],
      name: ["string", "undefined"],
      author: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getAudioMarkdown = (component: AudioComponentOptions): string => {
  // `$` alias resolve and file check
  component.src = aliasResolve(component.src);

  const { src, name, author } = component;

  return `\
<AudioPlayer src="${src}" title="${name ? `名称: ${name}` : ""} ${
    author ? `作者: ${author}` : ""
  }" />

`;
};
