import type {
  MapPageConfig,
  MarkersConfig,
  MusicList,
  QQAccountsConfig,
  WechatAccountConfig,
  WechatAccountsConfig,
} from "innenu-generator";
import {
  checkYamlFiles,
  getAccountListJSON,
  getCurrentChangedFiles,
  getMapPageJSON,
  getMarkersJSON,
  getMusicListJSON,
  getPageJSON,
  getWechatJSON,
} from "innenu-generator";
import type { PageConfig } from "innenu-generator/typings";

import { RESOURCE_FOLDERS } from "./generate/resource.js";
import { generateSettings } from "./generate/settings.js";

import "./config/env.js";

const diffFiles = getCurrentChangedFiles();

// 检查
RESOURCE_FOLDERS.forEach((folder) => {
  checkYamlFiles<PageConfig>(`./pages/${folder}`, (data, filePath) => {
    getPageJSON(data, `${folder}/${filePath}`, diffFiles);
  });
});

// 转换账号
checkYamlFiles<WechatAccountConfig>("./data/account", (data, filePath) => {
  getWechatJSON(data, filePath);
});

// 功能大厅
checkYamlFiles("./data/function", (data, filePath) => {
  if (/map\/marker\/benbu/u.exec(filePath)) {
    getMarkersJSON(data as MarkersConfig, "benbu");
  } else if (/map\/marker\/jingyue/u.exec(filePath)) {
    getMarkersJSON(data as MarkersConfig, "jingyue");
  } else if (/map\/(benbu|jingyue)\//u.exec(filePath)) {
    getMapPageJSON(data as MapPageConfig, `function/${filePath}`);
  } else if (/account\//u.exec(filePath)) {
    getAccountListJSON(
      data as WechatAccountsConfig | QQAccountsConfig,
      filePath,
    );
  } else if (/music\/index/u.exec(filePath)) {
    getMusicListJSON(data as MusicList, filePath);
  }
});

// 生成 tab 页
checkYamlFiles("./config", (data, filePath) => {
  if (/settings$/u.exec(filePath)) generateSettings(data);
});

console.info("All completed");
