import cpx from "cpx2";
import { deleteSync } from "del";
import { convertYamlFilesToMarkdown, getPageMarkdown } from "innenu-generator";
import type { PageConfig } from "innenu-generator/typings";

import { RESOURCE_FOLDERS } from "./generate/resource.js";
import "./config/env.js";

// 删除旧的文件
deleteSync(".site/**");

cpx.copySync("./site/**", "./.site/");
cpx.copySync("./site/.vuepress/**", "./.site/.vuepress");

// 生成对应的 Markdown
RESOURCE_FOLDERS.forEach((folder) => {
  convertYamlFilesToMarkdown(
    `./pages/${folder}`,
    `./.site/${folder}`,
    (data: PageConfig) => getPageMarkdown(data),
  );
});
