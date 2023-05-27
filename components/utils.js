import { SHA3 } from "crypto-js";

/**
 * @param  {string} text
 * @param  {number} length
 */
export function purgeText(text, length = 20) {
  if (text.length <= length) return text;
  return text.slice(0, length - 3) + "...";
}

// TODO: Generate a 'unique number'
export function createHash(data, len) {
  let hash = SHA3(data).toString();
  if (hash.length < len) {
    return hash;
  }
  return hash.slice(0, len);
}

export function generateUniqueId() {
  let [date, time] = new Date().toLocaleString("en-IN").split(", ");
  return (
    time.replace(" pm", "").split(":").slice(0, 3).join("") +
    date.split("/").join("")
  );
}

export function formatDate(date) {
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear().toString();

  day = day < 10 ? "0" + day.toString() : day.toString();
  month = month < 10 ? "0" + month.toString() : month.toString();
  year = year.slice(year.length - 2, year.length);

  return `${day}${month}${year}`;
}
/**
 * @param  {string} gstin
 */
export function checkGSTIN(gstin) {
  let matcher = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
  return matcher.test(gstin);
}
