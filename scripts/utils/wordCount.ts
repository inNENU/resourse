/**
 * Extract Latin words from content
 */
const getWords = (content: string): RegExpMatchArray | null =>
  // \u00C0-\u024F are Latin Supplement letters, maybe used in language like french
  // \u0400-\u04FF are Cyrillic letters, used in russian
  content.match(/[\w\d\s,.\u00C0-\u024F\u0400-\u04FF]+/giu);

/**
 * Extract Chinese Characters from content
 */
const getChinese = (content: string): RegExpMatchArray | null =>
  content.match(/[\u4E00-\u9FD5]/gu);

/**
 * Get word number of given string
 */
export const getWordNumber = (content: string): number =>
  (getWords(content)?.reduce<number>(
    (accumulator, word) =>
      accumulator + (word.trim() === "" ? 0 : word.trim().split(/\s+/u).length),
    0,
  ) || 0) + (getChinese(content)?.length || 0);
