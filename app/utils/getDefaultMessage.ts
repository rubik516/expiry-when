import English from "@/localization/en.json";

/** Return the default English message for a given key, in case some translations are missing.
 *
 * @method getDefaultMessage
 * @param key the key of the message found in localization/en.json
 *
 * @returns the English message corresponding to the given key
 */

export default function getDefaultMessage(key: string): string {
  return (English as Record<string, string>)[key] ?? "Empty message.";
}
