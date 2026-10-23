import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config.url.startsWith('/auth/')) window.dispatchEvent(new Event('auth-expired'));
  return Promise.reject(error);
});
export default api;
export const errorMessage = error => error.response?.data?.message || 'Cannot connect to the server. Please try again.';
// Fetch lookup pages without silently truncating dropdown options.
export async function allPages(path) {
  let page = 1,
    items = [],
    pages = 1;
  do {
    const response = await api.get(path, {
      params: {
        page,
        limit: 100
      }
    });
    items.push(...response.data.data.items);
    pages = response.data.data.pages;
    page++;
  } while (page <= pages);
  return items;
}
