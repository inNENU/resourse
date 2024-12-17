import hopeConfig, {
  config,
  globals,
  tsParser,
} from "eslint-config-mister-hope";
import { vue, vueParser } from "eslint-config-mister-hope/vue";

export default config(
  ...vue,
  ...hopeConfig,
  {
    ignores: [
      ".oss/**",
      ".resource/**",
      ".site/**",
      "**/node_modules/**",
      "coverage/**",
      "**/.vuepress/.cache/",
      "**/.vuepress/.temp/",
    ],
  },

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        tsconfigDirName: import.meta.dirname,
        project: "./tsconfig.json",
        extraFileExtensions: [".vue"],
      },
    },
  },

  {
    files: ["**/*.{ts,vue}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allowSingleOrDouble",
          trailingUnderscore: "allow",
        },
        {
          selector: ["variable"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allowSingleOrDouble",
          trailingUnderscore: "allowSingleOrDouble",
        },
        {
          selector: ["parameter"],
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        // allow locales path like `/zh/`, alias starting with `@` and css property like `line-width`
        {
          selector: ["property"],
          format: null,
          custom: {
            regex: "(^/$|^/.*/$)",
            match: true,
          },
          filter: "(^/$|^/.*/$)",
        },
        {
          selector: ["property"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "import",
          format: ["PascalCase", "camelCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
      ],
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "vue/block-lang": [
        "error",
        {
          script: { lang: "ts" },
          style: { lang: "scss" },
        },
      ],
    },
  },

  {
    files: ["scripts/**.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
