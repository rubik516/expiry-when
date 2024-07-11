/** Convert a snake cased string to camel cased string.
 *
 * @method snakeToCamel
 * @param snakeCase Snake cased string
 *
 * @returns Camel cased version of snakeCase
 */

export default function snakeToCamel(snakeCase: string): string {
  return snakeCase
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("_", ""));
}
