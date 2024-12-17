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

    const editLink = computed(() => ({
      text: "编辑此页",
      link: `https://github.com/inNENU/resource/edit/main/pages${page.value.path
        .replace(/\/$/, "/index.yml")
        .replace(/\.html$/, ".yml")}`,
    }));

    return (): VNode => {
      const { metaLocales } = themeLocale.value;

      return h("footer", { class: "vp-page-meta" }, [
        h(
          "div",
          { class: "vp-meta-item edit-link" },
          h(
            AutoLink,
            { class: "vp-meta-label", config: editLink.value },
            { before: () => h(EditIcon) },
          ),
        ),
        h("div", { class: "vp-meta-item git-info" }, [
          updateTime.value
            ? h("div", { class: "update-time" }, [
                h(
                  "span",
                  { class: "vp-meta-label" },
                  `${metaLocales.lastUpdated}: `,
                ),
                h(ClientOnly, () =>
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  h("span", { class: "vp-meta-info" }, updateTime.value!),
                ),
              ])
            : null,
          contributors.value?.length
            ? h("div", { class: "contributors" }, [
                h(
                  "span",
                  { class: "vp-meta-label" },
                  `${metaLocales.contributors}: `,
                ),
                contributors.value.map(
                  ({ email, name }, index, contributors) => [
                    h(
                      "span",
                      { class: "vp-meta-info", title: `email: ${email}` },
                      name,
                    ),
                    index !== contributors.length - 1 ? "," : "",
                  ],
                ),
              ])
            : null,
        ]),
      ]);
    };
  },
});
