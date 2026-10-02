import type { Interview } from '@/types'

/**
 * Placeholder interview service. Wire to the backend later.
 */
export const interviewService = {
  async list() {
    // return api.get('/interviews')
    return Promise.resolve({ data: [] as Interview[] })
  },

  async create(type: Interview['type']) {
    // return api.post('/interviews', { type })
    return Promise.resolve({ data: { message: 'Create interview placeholder', type } })
  },

  async getReport(id: string) {
    // return api.get(`/interviews/${id}/report`)
    return Promise.resolve({ data: { message: 'Report placeholder', id } })
  },
}
