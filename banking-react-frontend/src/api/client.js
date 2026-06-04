const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const headers = { ...options.headers };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const customersApi = {
  getAll: () => request("/api/customers"),
  getById: (id) => request(`/api/customers/${id}`),
  search: (name) =>
    request(`/api/customers/search?name=${encodeURIComponent(name)}`),
  getPremium: () => request("/api/customers/premium"),
  create: (body) =>
    request("/api/customers", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/api/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id) => request(`/api/customers/${id}`, { method: "DELETE" }),
};

export const accountsApi = {
  getAll: () => request("/api/accounts"),
  getById: (id) => request(`/api/accounts/${id}`),
  search: (name) =>
    request(`/api/accounts/search?name=${encodeURIComponent(name)}`),
  create: (body) =>
    request("/api/accounts", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/api/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id) => request(`/api/accounts/${id}`, { method: "DELETE" }),
};
