import { execSync } from "node:child_process";

import { deleteSync } from "del";

import type { AccountConfig, AccountDetail } from "./account.js";
import { checkAccount, checkAccountDetail } from "./account.js";
import { count } from "./count.js";
import type { Donate } from "./donate.js";
import { genDonate } from "./donate.js";
import { genIcon } from "./icon.js";
import { generateLicense } from "./license.js";
import { genLyric } from "./lyric.js";
import { resolveLocationPage } from "./map.js";
import type { MarkerOption } from "./marker.js";
import { resolveMarker } from "./marker.js";
import type { MusicInfo } from "./music.js";
import { checkMusic } from "./music.js";
import type { PEConfig } from "./peScore.js";
import { genPEScore } from "./peScore.js";
import { generateResource } from "./resource.js";
// import { genSearchMap } from "./search.js";
import { resolvePage, resolvePageContent } from "../components/page.js";
import type { ComponentOptions, PageConfig } from "../components/typings.js";
import { convertYml2Json } from "../utils/index.js";

// 删除旧的文件
deleteSync([
  "./d/function/**",
  "./d/icon/**",
  "./d/guide/**",
  "./d/intro/**",
  "./d/other/**",
]);

// 转换账号
convertYml2Json("./data/account", "./d/account", (data, filePath) =>
  checkAccountDetail(data as AccountDetail, filePath),
);

// 功能大厅
convertYml2Json("./data/function", "./d/function", (data, filePath) =>
  /map\/marker\/benbu/u.exec(filePath)
    ? resolveMarker(data as MarkerOption, "benbu")
    : /map\/marker\/jingyue/u.exec(filePath)
      ? resolveMarker(data as MarkerOption, "jingyue")
      : /map\/(benbu|jingyue)\//u.exec(filePath)
        ? resolveLocationPage(
            data as PageConfig & { photo?: string[] },
            `function/${filePath}`,
          )
        : /pe-calculator\/(male|female)-(low|high)/u.exec(filePath)
          ? genPEScore(data as PEConfig)
          : /account\//u.exec(filePath)
            ? checkAccount(data as AccountConfig[], filePath)
            : /music\/index/u.exec(filePath)
              ? checkMusic(data as MusicInfo[], filePath)
              : (data as unknown),
);

// 转换搜索
convertYml2Json(
  "./data/search",
  "./d/search",
  (data: unknown): unknown => data,
);

/** 差异列表 */
const diffResult = execSync("git status -s").toString();

["apartment", "school", "newcomer", "intro", "guide", "other"].forEach(
  (folder) => {
    convertYml2Json(`./pages/${folder}`, `./d/${folder}`, (data, filePath) =>
      resolvePage(data as PageConfig, `${folder}/${filePath}`, diffResult),
    );
  },
);

// 生成转码后的图标
genIcon();

// 生成搜索索引
// genSearchMap();

// 生成歌词
genLyric();

// 生成捐赠
convertYml2Json("./config/donate", "./d/other/donate", (data, filePath) =>
  genDonate(data as Donate, filePath),
);

// 生成 Sitemap
// genSitemap();
count();

// 重新生成 guide
convertYml2Json("./pages/other/guide", "./d/other/guide", (data, filePath) =>
  resolvePage(data as PageConfig, filePath),
);

// 生成 tab 页
convertYml2Json("./config", "./d/config", (data, filePath) => {
  if (/settings/u.exec(filePath)) {
    const {
      "main-presets": mainPresets,
      "function-presets": functionPresets,
      about,
      ...rest
    } = data as Record<string, unknown> & {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "main-presets": Record<string, ComponentOptions[]>;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "function-presets": Record<string, ComponentOptions[]>;
      about: ComponentOptions[];
    };

    return {
      ...rest,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "main-presets": Object.fromEntries(
        Object.entries(mainPresets).map(([key, value]) => [
          key,
          resolvePageContent(value, `settings.main-presets.${key}`, "pages"),
        ]),
      ),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "function-presets": Object.fromEntries(
        Object.entries(functionPresets).map(([key, value]) => [
          key,
          resolvePageContent(
            value,
            `settings.function-presets.${key}`,
            "pages",
          ),
        ]),
      ),
      about: resolvePageContent(about, "settings.about", "pages"),
    };
  }

  return data as unknown;
});

await generateLicense();

// 生成资源
generateResource();

console.info("All completed");
