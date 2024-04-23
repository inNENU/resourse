import type { AnyNode } from "cheerio";
import { load } from "cheerio";

const $ = load("");

export const parseHTML = (content: string): AnyNode[] =>
  $.parseHTML(content) || [];
