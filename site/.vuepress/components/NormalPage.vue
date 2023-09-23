<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import { computed } from "vue";
import HopeNormalPage from "vuepress-theme-hope/components/NormalPage.js";

const page = usePageData();

const isEnabled = computed(() =>
  ["/apartment/", "/guide/", "/intro/", "/newcomer/", "/school/"].some((item) =>
    page.value.path.startsWith(item),
  ),
);
const id = computed(() => page.value.path.replace(/\.html$/, ""));
</script>
<template>
  <HopeNormalPage>
    <template #contentBefore>
      <div v-if="isEnabled" class="open-app-wrapper">
        <a class="open-app-button" :href="`innenu://pages/info/info?id=${id}`">
          打开 App 查看
        </a>
      </div>
    </template>
  </HopeNormalPage>
</template>

<style lang="scss">
@use "vuepress-shared/styles/wrapper";

.open-app-wrapper {
  @include wrapper.horizontal-wrapper;

  text-align: right;
}

.open-app-button {
  display: inline-block;

  margin: 6px 0;
  padding: 4px 8px;
  border-radius: 8px;

  background-color: var(--theme-color);
  color: var(--white);

  font-size: 14px;
  line-height: 1.5;
}
</style>
