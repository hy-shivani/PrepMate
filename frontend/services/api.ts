import axios from 'axios'

/**
 * Central Axios instance.
 *
 * This is a placeholder client only. It is pre-configured to point at a future
 * Express.js + MongoDB backend via NEXT_PUBLIC_API_URL. No real requests are
 * made in this frontend-only build.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Example interceptor scaffold for future auth token injection.
api.interceptors.request.use((config) => {
  // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
