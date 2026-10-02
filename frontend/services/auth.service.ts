import type { AuthPayload, SignupPayload } from '@/types'

import api from './api'

/**
 * Placeholder auth service. Wire these to the Express.js + MongoDB backend
 * later. No authentication is implemented in this frontend build.
 */
export const authService = {
  async login(payload: AuthPayload) {
    return api.post("/auth/login", payload);
  },

  async signup(payload: SignupPayload) {
    return api.post("/auth/signUp", payload);
  },

  async logout() {
    return api.post("/auth/logout");
  },

  async me() {
    return api.get("/profile");
  },
}

export { api }
