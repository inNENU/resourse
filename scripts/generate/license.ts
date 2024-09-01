import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { frontmatterPlugin } from "@mdit-vue/plugin-frontmatter";
import { getFileList } from "innenu-generator";
import MarkdownIt from "markdown-it";

import { getRichTextNodes } from "../utils/index.js";

const markdownIt = new MarkdownIt().use(frontmatterPlugin);

export const generateLicense = (): Promise<void[]> => {
  const fileList = getFileList("./config", "md");

  const licenseFiles = fileList.filter(
    (path) => path.endsWith("/license.md") || path.endsWith("/privacy.md"),
  );

  return Promise.all(
    licenseFiles.map(async (file) => {
      const targetFilename = `./.resource/config/${file.replace(/\.md$/, "-data.json")}`;
      const targetFolderName = dirname(targetFilename);

      if (!existsSync(targetFolderName))
        mkdirSync(targetFolderName, { recursive: true });

      const content = readFileSync(`./config/${file}`, "utf-8");
      const env: { frontmatter: Record<string, unknown> } = {
        frontmatter: {},
      };

      const nodes = await getRichTextNodes(markdownIt.render(content, env));

      writeFileSync(
        targetFilename,
        JSON.stringify({ nodes, ...env.frontmatter }),
        "utf-8",
      );
    }),
  );
};
