import { checkKeys } from "@mr-hope/assert-type";

import { PhoneComponentOptions } from "./typings.js";

export const resolvePhone = (
  element: PhoneComponentOptions,
  location = "",
): void => {
  for (const key in element)
    if (typeof element[key as keyof PhoneComponentOptions] === "number")
      // @ts-ignore
      // eslint-disable-next-line
      element[key] = element[key].toString();

  checkKeys(
    element,
    {
      tag: "string",
      num: "string",
      fName: "string",
      header: ["string", "undefined"],
      lName: ["string", "undefined"],
      org: ["string", "undefined"],
      remark: ["string", "undefined"],
      workNum: ["string", "undefined"],
      nick: ["string", "undefined"],
      site: ["string", "undefined"],
      wechat: ["string", "undefined"],
      province: ["string", "undefined"],
      city: ["string", "undefined"],
      street: ["string", "undefined"],
      postCode: ["string", "undefined"],
      title: ["string", "undefined"],
      hostNum: ["string", "undefined"],
      mail: ["string", "undefined"],
      homeNum: ["string", "undefined"],
      avatar: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location,
  );
};

export const getPhoneMarkdown = (component: PhoneComponentOptions): string => {
  const {
    header = "",
    fName,
    lName = "",
    num,
    workNum,
    homeNum,
    hostNum,
    nick,
    org,
    title,
    remark,
    province = "",
    city = "",
    street = "",
    postCode,
    mail,
    site,
  } = component;

  return `\
::: info ${header || `${lName}${fName} 联系方式`}

- 姓名: ${lName}${fName}
- 电话: [${num}](tel:${num})
${workNum ? `- 工作电话: ${workNum}\n` : ""}\
${hostNum ? `- 公司电话: ${hostNum}\n` : ""}\
${homeNum ? `- 家庭电话: ${homeNum}\n` : ""}\
${site ? `- 网站: <${site}>\n` : ""}\
${mail ? `- 邮箱: [${mail}](mailto:${mail})\n` : ""}\
${org ? `- 组织: ${org}\n` : ""}\
${title ? `- 职位: ${title}\n` : ""}\
${nick ? `- 昵称: ${nick}\n` : ""}\
${remark ? `- 备注: ${remark}\n` : ""}\
${province || city || street ? `- 地址: ${province}${city}${street}\n` : ""}\
${postCode ? `- 邮编: ${postCode}\n` : ""}\

:::

`;
};
