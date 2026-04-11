// =====================================================
//  API CONFIGURATION
//  Vercel proxies /api/* → Railway backend (vercel.json)
//  This avoids all CORS issues on iOS Safari.
// =====================================================

export const BASE_URL = '/api/v1';


// Attach JWT token to every request automatically
const getHeaders = (isMultipart = false, customToken = null) => {
  const token = customToken || localStorage.getItem('aishop_token');
  const headers = {};
  if (!isMultipart) headers['Content-Type'] = 'application/json';
  if (token)        headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Generic fetch wrapper with error handling
const request = async (method, path, body = null, isMultipart = false, customToken = null) => {
  const config = {
    method,
    headers: getHeaders(isMultipart, customToken),
  };
  if (body && !isMultipart) config.body = JSON.stringify(body);
  if (body &&  isMultipart) config.body = body; // FormData

  const res  = await fetch(`${BASE_URL}${path}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data;
};

// Convenience methods
export const api = {
  get:    (path)                          => request('GET',    path),
  post:   (path, body, customToken)       => request('POST',   path, body, false, customToken),
  put:    (path, body)                    => request('PUT',    path, body),
  patch:  (path, body)                    => request('PATCH',  path, body),
  delete: (path)                          => request('DELETE', path),
  upload: (path, formData)               => request('POST',   path, formData, true),
};

export default api;