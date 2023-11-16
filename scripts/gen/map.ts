import { resolvePage } from "../components/page.js";
import { type PageConfig, type PageOptions } from "../components/typings.js";
import { resolveAlias } from "../components/utils.js";

export const resolveLocationPage = (
  data: PageConfig & { photo?: string[] },
  filePath: string
): PageOptions & { photo?: string[] } => {
  if (data.photo)
    data.photo = data.photo.map((link, index) =>
      // `$` alias resolve and file check
      resolveAlias(link, "Image", `${filePath}.photos[${index}]`)
    );

  return resolvePage(data, filePath);
};
