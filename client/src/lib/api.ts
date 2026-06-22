// Thin fetch wrapper for the Express API. In dev, Vite proxies /api to the
// server, so relative URLs keep the browser single-origin and cookies flow
// automatically. Set VITE_API_URL only if hosting the API on another origin.
const BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parse(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new ApiError(data?.error || res.statusText || "Request failed", res.status);
  }
  return data;
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    credentials: "include",
    ...options,
  });
  return parse(res);
}

function jsonRequest(path: string, method: string, body?: unknown) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) => jsonRequest(path, "POST", body),
  patch: (path: string, body?: unknown) => jsonRequest(path, "PATCH", body),
  del: (path: string, body?: unknown) => jsonRequest(path, "DELETE", body),
  /** multipart/form-data — do NOT set Content-Type; the browser adds the boundary. */
  postForm: (path: string, form: FormData) => request(path, { method: "POST", body: form }),
};
