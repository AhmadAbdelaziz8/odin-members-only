const API_BASE_URL = 'http://localhost:3000';

const defaultOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const api = {
  get: (endpoint) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'GET',
    }).then(handleResponse),

  post: (endpoint, data) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(data),
    }).then(handleResponse),

  patch: (endpoint, data) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (endpoint) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'DELETE',
    }).then(handleResponse),
};