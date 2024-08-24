import { checkKeys } from "@mr-hope/assert-type";

import type { AccountComponentOptions } from "./typings.js";
import { getAssetIconLink, resolveAlias } from "../utils.js";

export const resolveAccount = (
  component: AccountComponentOptions,
  location = "",
): void => {
  // `$` alias resolve and file check
  if (component.logo)
    component.logo = resolveAlias(component.logo, "Image", location);
  if (component.qqcode)
    component.qqcode = resolveAlias(component.qqcode, "Image", location);
  if (component.wxcode)
    component.wxcode = resolveAlias(component.wxcode, "Image", location);

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
      loc: ["string", "undefined"],
      mail: ["string", "undefined"],
      site: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );

  if (component.loc) {
    const [latitude, longitude] = component.loc.split(",").map(Number);

    // @ts-expect-error: Backward compatibility
    component.location = { latitude, longitude };
  }
};

export const getAccountMarkdown = (
  component: AccountComponentOptions,
): string => {
  // `$` alias resolve and file check
  if (component.logo) component.logo = resolveAlias(component.logo);
  if (component.qqcode) component.qqcode = resolveAlias(component.qqcode);
  if (component.wxcode) component.wxcode = resolveAlias(component.wxcode);

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
  (qq ?? qqcode)
    ? `\
    <button class="innenu-account-action" ${
      qq ? `aria-label="${qq}" data-balloon-pos="up" data-qq="${qq}" ` : ""
    }${qqcode ? `data-qqcode="${qqcode}"` : ""}>
      <img class="innenu-account-icon" src="${getAssetIconLink(
        "qq",
      )}" alt="" no-view />
    </button>
`
    : ""
}\
${
  (wxid ?? wxcode)
    ? `\
    <button class="innenu-account-action" ${
      wxid ? `data-wxid="${wxid}" ` : ""
    }${wxcode ? `data-wxcode="${wxcode}" ` : ""}>
      <img class="innenu-account-icon" src="${getAssetIconLink(
        "wechat",
      )}" alt="" no-view />
    </button>
`
    : ""
}\
${
  site
    ? `\
    <a class="innenu-account-action" href="${site}" target="_blank">
      <img class="innenu-account-icon" src="${getAssetIconLink(
        "web",
      )}" alt="" no-view />
    </a>
`
    : ""
}\
${
  mail
    ? `\
    <a class="innenu-account-action" href="mailto:${mail}">
      <img class="innenu-account-icon" src="${getAssetIconLink(
        "mail",
      )}" alt="" no-view />
    </a>
`
    : ""
}\
  </div>
</div>

`;
};
