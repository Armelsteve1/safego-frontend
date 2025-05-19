const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API : ${res.status}`);
  }

  return res.json();
};

export const apiFetchWithAuth = async (
  endpoint: string,
  token: string,
  options: RequestInit = {}
) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API : ${res.status}`);
  }

  return res.json();
};
