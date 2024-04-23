import type { VNode } from "vue";
import { computed, defineComponent, h } from "vue";
import { ClientOnly, usePageData } from "vuepress/client";
import AutoLink from "vuepress-theme-hope/components/AutoLink.js";
import { EditIcon } from "vuepress-theme-hope/components/icons/index.js";
import { useThemeLocaleData } from "vuepress-theme-hope/composables/index.js";
import {
  useContributors,
  useUpdateTime,
} from "vuepress-theme-hope/modules/info/composables/index.js";

import "vuepress-theme-hope/info/styles/page-meta.scss";

export default defineComponent({
  name: "PageMeta",

  setup() {
    const page = usePageData();
    const themeLocale = useThemeLocaleData();
    const updateTime = useUpdateTime();
    const contributors = useContributors();

    const editLink = computed(
      () =>
        `https://github.com/inNENU/resource/edit/main/pages${page.value.path
          .replace(/\/$/, "/index.yml")
          .replace(/\.html$/, ".yml")}`,
    );

    return (): VNode => {
      const { metaLocales } = themeLocale.value;

      return h("footer", { class: "page-meta" }, [
        h(
          "div",
          { class: "meta-item edit-link" },
          h(
            AutoLink,
            {
              class: "label",
              config: { text: "编辑此页", link: editLink.value },
            },
            { before: () => h(EditIcon) },
          ),
        ),
        h("div", { class: "meta-item git-info" }, [
          updateTime.value
            ? h("div", { class: "update-time" }, [
                h("span", { class: "label" }, `${metaLocales.lastUpdated}: `),
                h(ClientOnly, () =>
                  h("span", { class: "info" }, updateTime.value!),
                ),
              ])
            : null,
          contributors.value?.length
            ? h("div", { class: "contributors" }, [
                h("span", { class: "label" }, `${metaLocales.contributors}: `),
                contributors.value.map(({ email, name }, index) => [
                  h(
                    "span",
                    { class: "contributor", title: `email: ${email}` },
                    name,
                  ),
                  index !== contributors.value!.length - 1 ? "," : "",
                ]),
              ])
            : null,
        ]),
      ]);
    };
  },
});
