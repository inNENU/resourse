import { execSync } from "node:child_process";

import cpx from "cpx2";
import { deleteSync } from "del";
import type {
  MapPageConfig,
  MarkersConfig,
  MusicList,
  QQAccountsConfig,
  WechatAccountConfig,
  WechatAccountsConfig,
} from "innenu-generator";
import {
  convertYml2Json,
  generateLyrics,
  getAccountListJSON,
  getMapPageJSON,
  getMarkersJSON,
  getMusicListJSON,
  getPageJSON,
  getWechatJSON,
} from "innenu-generator";
import type { PageConfig } from "innenu-generator/typings";

import { count } from "./count.js";
import type { Donate } from "./donate.js";
import { generateDonate } from "./donate.js";
import { genIcon } from "./icon.js";
import { generateLicense } from "./license.js";
import type { PEConfig } from "./peScore.js";
import { generatePEScore } from "./peScore.js";
import { generateResource } from "./resource.js";
import { generateSettings } from "./settings.js";

import "../env.js";

// 删除旧的文件
deleteSync(["./.resource/**"]);

// 转换账号
convertYml2Json("./data/account", "./.resource/account", (data, filePath) =>
  getWechatJSON(data as WechatAccountConfig, filePath),
);

// 功能大厅
convertYml2Json("./data/function", "./.resource/function", (data, filePath) =>
  /map\/marker\/benbu/u.exec(filePath)
    ? getMarkersJSON(data as MarkersConfig, "benbu")
    : /map\/marker\/jingyue/u.exec(filePath)
      ? getMarkersJSON(data as MarkersConfig, "jingyue")
      : /map\/(benbu|jingyue)\//u.exec(filePath)
        ? getMapPageJSON(data as MapPageConfig, `function/${filePath}`)
        : /pe-calculator\/(male|female)-(low|high)/u.exec(filePath)
          ? generatePEScore(data as PEConfig)
          : /account\//u.exec(filePath)
            ? getAccountListJSON(
                data as WechatAccountsConfig | QQAccountsConfig,
                filePath,
              )
            : /music\/index/u.exec(filePath)
              ? getMusicListJSON(data as MusicList, filePath)
              : (data as unknown),
);

// 转换搜索
convertYml2Json(
  "./data/search",
  "./.resource/search",
  (data: unknown): unknown => data,
);

/** 差异列表 */
const diffResult = execSync("git status -s").toString();

["apartment", "school", "newcomer", "intro", "guide", "other"].forEach(
  (folder) => {
    convertYml2Json(
      `./pages/${folder}`,
      `./.resource/${folder}`,
      (data, filePath) =>
        getPageJSON(data as PageConfig, `${folder}/${filePath}`, diffResult),
    );
  },
);

// 生成转码后的图标
genIcon();

// 生成歌词
generateLyrics("./data/function/music", "./.resource/function/music");

// 生成捐赠
convertYml2Json(
  "./config/donate",
  "./.resource/other/donate",
  (data, filePath) => generateDonate(data as Donate, filePath),
);

// 生成 Sitemap
// genSitemap();
count();

// 重新生成 guide
convertYml2Json(
  "./pages/other/guide",
  "./.resource/other/guide",
  (data, filePath) => getPageJSON(data as PageConfig, filePath),
);

// 生成 tab 页
convertYml2Json("./config", "./.resource/config", (data, filePath) => {
  if (/item$/u.exec(filePath) || /group$/u.exec(filePath)) return null;

  if (/settings$/u.exec(filePath)) return generateSettings(data);

  return data as unknown;
});

await generateLicense();

// 生成资源
generateResource();

// 复制图标
cpx.copySync("./data/icon/**", "./.resource/icons");
// 复制服务
cpx.copySync("./service/**", "./.resource/service");

console.info("All completed");
