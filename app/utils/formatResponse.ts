import snakeToCamel from "@/utils/snakeToCamel";

export default function formatResponse(response: unknown) {
  const formattedResponse = recursiveSnakeKeysToCamelCase(response);
  return formattedResponse;
}

function recursiveSnakeKeysToCamelCase(response: unknown): unknown {
  if (response === null || typeof response !== "object") {
    return response;
  }

  if (Array.isArray(response)) {
    return response.map((item) =>
      recursiveSnakeKeysToCamelCase(item)
    ) as unknown;
  }

  return Object.fromEntries(
    Object.entries(response).map(([snakeCaseKey, value]: [string, unknown]) => {
      if (Array.isArray(value) || typeof value === "object") {
        value = recursiveSnakeKeysToCamelCase(value);
      }
      return [snakeToCamel(snakeCaseKey), value];
    })
  ) as unknown;
}
