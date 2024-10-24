import { deleteSync } from "del";
import { convertYamlFilesToMarkdown, getPageText } from "innenu-generator";
import type { PageConfig } from "innenu-generator/typings";
import "./config/env.js";

// 删除旧的文件
deleteSync(".text/**");

convertYamlFilesToMarkdown("./pages", "./.text", (data, filePath) =>
  getPageText(data as PageConfig, filePath),
);
