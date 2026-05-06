import type { ZodSchema } from "zod";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly statusText: string,
    readonly url: string,
  ) {
    super(`HTTP ${status} ${statusText} on ${url}`);
    this.name = "HttpError";
  }
}

export interface HttpRequest extends RequestInit {
  url: string;
}

export async function http<T>(schema: ZodSchema<T>, request: HttpRequest): Promise<T> {
  const { url, headers, ...init } = request;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, url);
  }

  const data: unknown = await response.json();
  return schema.parse(data);
}
