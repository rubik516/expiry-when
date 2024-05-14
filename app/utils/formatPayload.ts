import camelToSnake from "./camelToSnake";

export default function formatPayload(payload: object) {
  const formattedPayload = recursiveCamelKeysToSnakeCase(payload);
  return formattedPayload;
}

function recursiveCamelKeysToSnakeCase(payload: unknown): unknown {
  if (payload === null || typeof payload !== "object") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) =>
      recursiveCamelKeysToSnakeCase(item)
    ) as unknown;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([camelCaseKey, value]: [string, unknown]) => {
      if (Array.isArray(value) || typeof value === "object") {
        value = recursiveCamelKeysToSnakeCase(value);
      }
      return [camelToSnake(camelCaseKey), value];
    })
  ) as unknown;
}
