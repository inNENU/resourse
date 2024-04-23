import { defineClientConfig } from "vuepress/client";

import { setupAccount } from "./composables/index.js";

export default defineClientConfig({
  setup() {
    setupAccount();
  },
});
