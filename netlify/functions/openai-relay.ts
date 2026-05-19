type RelayEvent = {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
};

type RelayBody = {
  requestBody?: Record<string, unknown>;
};

export const handler = async (event: RelayEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, message: "Method not allowed" })
    };
  }

  const relayToken = process.env.OPENAI_RELAY_TOKEN?.trim() || "";
  const apiKey = process.env.OPENAI_API_KEY?.trim() || "";
  const defaultModel = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  if (!relayToken || !apiKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, message: "Relay env is not configured" })
    };
  }

  const providedToken = event.headers?.["x-openai-relay-token"] || event.headers?.["X-Openai-Relay-Token"] || "";
  if (providedToken.trim() !== relayToken) {
    return {
      statusCode: 401,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, message: "Unauthorized" })
    };
  }

  let parsed: RelayBody;
  try {
    parsed = JSON.parse(event.body || "{}") as RelayBody;
  } catch {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, message: "Invalid JSON body" })
    };
  }

  if (!parsed.requestBody || typeof parsed.requestBody !== "object" || Array.isArray(parsed.requestBody)) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, message: "requestBody is required" })
    };
  }

  const requestBody = {
    ...parsed.requestBody,
    model:
      typeof parsed.requestBody.model === "string" && parsed.requestBody.model.trim()
        ? parsed.requestBody.model
        : defaultModel
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    let responseJson: unknown;

    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = { raw: responseText };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          ok: false,
          message: "OpenAI request failed",
          details: responseJson
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        ok: true,
        data: responseJson
      })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
