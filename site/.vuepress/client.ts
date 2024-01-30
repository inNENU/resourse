import type { ClientConfig } from "vuepress/client";
import { defineClientConfig } from "vuepress/client";
import { setupAccount } from "./composables/index.js";

export default <ClientConfig>defineClientConfig({
  setup() {
    setupAccount();
  },
});
