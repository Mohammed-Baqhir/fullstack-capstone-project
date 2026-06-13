const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3060';

export function getApiUrl(path) {
  return `${API_URL}${path}`;
}
