import { readFileSync, writeFileSync } from "node:fs";

import { frontmatterPlugin } from "@mdit-vue/plugin-frontmatter";
import MarkdownIt from "markdown-it";

import { getFileList, getRichTextNodes } from "../utils/index.js";

const markdownIt = new MarkdownIt().use(frontmatterPlugin);

export const generateLicense = (): Promise<void> => {
  const fileList = getFileList("./config", "md");

  const licenseFiles = fileList.filter(
    (path) => path.endsWith("/license.md") || path.endsWith("/privacy.md"),
  );

  return Promise.all(
    licenseFiles.map(async (file) => {
      const content = readFileSync(`./config/${file}`, "utf-8");
      const env: { frontmatter: Record<string, unknown> } = { frontmatter: {} };

      const nodes = await getRichTextNodes(markdownIt.render(content, env));

      writeFileSync(
        `./d/config/${file.replace(/\.md$/, "-data.json")}`,
        JSON.stringify({ nodes, ...env.frontmatter }),
        "utf-8",
      );
    }),
  );
};
