export async function useFetch(
  url: string,
  authToken: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  body: object | File | null = null
): Promise<Response> {
  if (!authToken) {
    throw new Error(
      "Authentication token is not defined in environment variables."
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof File || body instanceof Blob) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
  }

  const response: Response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response; // Return the raw Response object
}
