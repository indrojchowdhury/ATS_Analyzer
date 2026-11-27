const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

function getErrorMessage(result, status) {
  if (result?.message) return result.message;

  const errors = result?.errors;
  if (errors) {
    const messages = Object.values(errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string");
    if (messages.length) return messages.join(" ");
  }

  return `Request failed with status ${status}.`;
}

export async function authRequest(path, { body, token, method } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
      method: method ?? (body ? "POST" : "GET"),
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend. Make sure the Django server is running."
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response received from the server.");
  }

  if (!response.ok || result.success === false) {
    throw new Error(getErrorMessage(result, response.status));
  }

  return result;
}
