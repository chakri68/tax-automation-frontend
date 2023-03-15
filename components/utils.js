/**
 * @param  {string} text
 * @param  {number} length
 */
export function purgeText(text, length = 20) {
  if (text.length <= length) return text;
  return text.slice(0, length - 3) + "...";
}
