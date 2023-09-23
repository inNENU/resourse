import { type AnyNode, load } from "cheerio";

const $ = load("");

export const parseHTML = (content: string): AnyNode[] =>
  $.parseHTML(content) || [];
