import { checkKeys } from "@mr-hope/assert-type";

import { type AccountComponentOptions } from "./typings.js";
import { aliasResolve, getIconLink } from "../utils.js";

export const resolveAccount = (
  component: AccountComponentOptions,
  location = "",
): void => {
  // `$` alias resolve and file check
  if (component.logo)
    component.logo = aliasResolve(component.logo, "Image", location);
  if (component.qqcode)
    component.qqcode = aliasResolve(component.qqcode, "Image", location);
  if (component.wxcode)
    component.wxcode = aliasResolve(component.wxcode, "Image", location);

  checkKeys(
    component,
    {
      tag: "string",
      name: "string",
      logo: "string",
      detail: ["string", "undefined"],
      desc: ["string", "undefined"],
      qq: ["number", "undefined"],
      qqid: ["string", "undefined"],
      qqcode: ["string", "undefined"],
      wxid: ["string", "undefined"],
      wxcode: ["string", "undefined"],
      account: ["string", "undefined"],
      location: ["object", "undefined"],
      mail: ["string", "undefined"],
      site: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );

  // check location
  if (component.location)
    checkKeys(
      component.location,
      { latitude: "number", longitude: "number" },
      `${location}.location`,
    );
};

export const getAccountMarkdown = (
  component: AccountComponentOptions,
): string => {
  // `$` alias resolve and file check
  if (component.logo) component.logo = aliasResolve(component.logo);
  if (component.qqcode) component.qqcode = aliasResolve(component.qqcode);
  if (component.wxcode) component.wxcode = aliasResolve(component.wxcode);

  const { name, detail, desc, logo, qq, qqcode, wxid, wxcode, site, mail } =
    component;

  return `\
<div class="innenu-account">
  <img class="innenu-account-background" src="${logo}" alt="${name}" loading="lazy" no-view />
  <div class="innenu-account-content">
    <img class="innenu-account-logo" src="${logo}" alt="${name}" loading="lazy" no-view />
    <div class="innenu-account-name">${name}</div>
${
  detail
    ? `\
    <div class="innenu-account-detail">${detail}</div>
`
    : ""
}\
${
  desc
    ? `\
    <div class="innenu-account-description">${desc}</div>
`
    : ""
}\
  </div>
  <div class="innenu-account-action-list">
${
  qq || qqcode
    ? `\
    <button class="innenu-account-action" ${
      qq ? `aria-label="${qq}" data-balloon-pos="up" data-qq="${qq}" ` : ""
    }${qqcode ? `data-qqcode="${qqcode}"` : ""}>
      <img class="innenu-account-icon" src="${getIconLink("qq")}" no-view />
    </button>
`
    : ""
}\
${
  wxid || wxcode
    ? `\
    <button class="innenu-account-action" ${
      wxid ? `data-wxid="${wxid}" ` : ""
    }${wxcode ? `data-wxcode="${wxcode}" ` : ""}>
      <img class="innenu-account-icon" src="${getIconLink("wechat")}" no-view />
    </button>
`
    : ""
}\
${
  site
    ? `\
    <a class="innenu-account-action" href="${site}" target="_blank">
      <img class="innenu-account-icon" src="${getIconLink("web")}" no-view />
    </a>
`
    : ""
}\
${
  mail
    ? `\
    <a class="innenu-account-action" href="mailto:${mail}">
      <img class="innenu-account-icon" src="${getIconLink("mail")}" no-view />
    </a>
`
    : ""
}\
  </div>
</div>

`;
};
