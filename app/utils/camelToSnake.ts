/** Convert a camel cased string to snake cased string.
 *
 * @method camelToSnake
 * @param camelCase Camel cased string
 *
 * @returns Snake cased version of camelCase
 */

export default function camelToSnake(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}
