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
  convertYamlFilesToJson,
  generateLyrics,
  generateSvgIcons,
  getAccountListJSON,
  getCurrentChangedFiles,
  getMapPageJSON,
  getMarkersJSON,
  getMusicListJSON,
  getPageJSON,
  getWechatJSON,
} from "innenu-generator";
import type { PageConfig, PageData } from "innenu-generator/typings";

import type { Donate } from "./generate/donate.js";
import { generateDonate } from "./generate/donate.js";
import { generateLicense } from "./generate/license.js";
import type { PEConfig } from "./generate/peScore.js";
import { generatePEScore } from "./generate/peScore.js";
import { RESOURCE_FOLDERS, generateResource } from "./generate/resource.js";
import { generateSettings } from "./generate/settings.js";
import { updateWordCount } from "./generate/wordCount.js";

import "./config/env.js";

const diffFiles = getCurrentChangedFiles();

// 删除旧的文件
deleteSync("./.resource/**");

// 生成资源
RESOURCE_FOLDERS.forEach((folder) => {
  convertYamlFilesToJson<PageConfig, PageData>(
    `./pages/${folder}`,
    `./.resource/${folder}`,
    (data, filePath) => getPageJSON(data, `${folder}/${filePath}`, diffFiles),
  );
});

// 转换账号
convertYamlFilesToJson<WechatAccountConfig>(
  "./data/account",
  "./.resource/account",
  (data, filePath) => getWechatJSON(data, filePath),
);

// 功能大厅
convertYamlFilesToJson(
  "./data/function",
  "./.resource/function",
  (data, filePath) =>
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
                : data,
);

// 转换搜索
convertYamlFilesToJson("./data/search", "./.resource/search");

// 生成协议
await generateLicense();

// 生成转码后的图标
generateSvgIcons("./data/icon", "./.resource/icon");

// 生成歌词
generateLyrics("./data/function/music", "./.resource/function/music");

// 生成捐赠
convertYamlFilesToJson<Donate, PageData>(
  "./config/donate",
  "./.resource/other/donate",
  (data, filePath) => generateDonate(data, filePath),
);

// 更新字数
updateWordCount();

// 生成 tab 页
convertYamlFilesToJson("./config", "./.resource/config", (data, filePath) => {
  if (/item$/u.exec(filePath) || /group$/u.exec(filePath)) return null;

  if (/settings$/u.exec(filePath)) return generateSettings(data);

  return data;
});

// 生成资源
generateResource(diffFiles);

// 复制图标
cpx.copySync("./data/icon/**", "./.resource/icons");
// 复制服务
cpx.copySync("./service/**", "./.resource/service");
// 复制 schema 配置
cpx.copySync("./.vscode/**", "./.resource/.vscode");

console.info("All completed");
