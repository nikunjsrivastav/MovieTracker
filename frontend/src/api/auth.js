import {
  apiRequest,
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from './client.js';

export function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function fetchCurrentUser(token = getStoredAuthToken()) {
  return apiRequest('/users/me', {
    token,
  });
}

export function updateCurrentUser(updates, token = getStoredAuthToken()) {
  return apiRequest('/users/me', {
    method: 'PATCH',
    body: updates,
    token,
  });
}

export function deleteCurrentUser(token = getStoredAuthToken()) {
  return apiRequest('/users/me', {
    method: 'DELETE',
    token,
  });
}

export {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
};
