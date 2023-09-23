import { checkKeys } from "@mr-hope/assert-type";

import { type DocComponentOptions } from "./typings.js";
import { aliasResolve, getIconLink } from "../utils.js";

/**
 * 获得文档图标
 *
 * @param url 文档地址
 */
const getDocIcon = (url: string): string => {
  if (!url) return "";

  const docType = url.split(".").pop();

  return docType === "docx" || docType === "doc"
    ? "doc"
    : docType === "pptx" || docType === "ppt"
    ? "ppt"
    : docType === "xlsx" || docType === "xls"
    ? "xls"
    : docType === "jpg" || docType === "jpeg" || docType === "jfif"
    ? "jpg"
    : docType === "mp4" ||
      docType === "mov" ||
      docType === "avi" ||
      docType === "rmvb"
    ? "video"
    : docType === "pdf"
    ? "pdf"
    : docType === "png" || docType === "gif"
    ? docType
    : "document";
};

export const resolveDoc = (
  element: DocComponentOptions,
  location = "",
): void => {
  element.icon = getDocIcon(element.url);

  // `$` alias resolve and file check
  if (element.url) element.url = aliasResolve(element.url, "File", location);

  checkKeys(
    element,
    {
      tag: "string",
      icon: "string",
      name: "string",
      url: "string",
      downloadable: { type: ["undefined"], additional: [true] },
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getDocMarkdown = (component: DocComponentOptions): string => {
  // `$` alias resolve and file check
  component.url = aliasResolve(component.url);

  const { name, url } = component;

  const docIcon = `<img class="innenu-doc-icon" src="${getIconLink(
    getDocIcon(url),
  )}" alt="${name}" />`;
  const docName = `${name}.${url.split(".").pop()!}`;

  return `
${
  url.match(/\.(pdf|jpe?g|png|bmp|svg)$/)
    ? `
<a class="innenu-doc" href="${url}" name="${docName}" target="_blank" rel="noopener noreferrer">
  ${docIcon}
  ${docName}
</a>
`
    : `
<a class="innenu-doc" href="${url}" download="${name}">${docIcon}${docName}</a>
`
}
`;
};
