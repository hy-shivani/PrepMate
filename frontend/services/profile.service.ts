import type { Profile } from '@/types'

/**
 * Placeholder profile service. Wire to the backend later.
 */
export const profileService = {
  async getProfile() {
    // return api.get('/profile')
    return Promise.resolve({ data: null })
  },

  async updateProfile(payload: Partial<Profile>) {
    // return api.put('/profile', payload)
    return Promise.resolve({ data: { message: 'Profile update placeholder', payload } })
  },

  async uploadResume(file: File) {
    // const form = new FormData(); form.append('resume', file)
    // return api.post('/profile/resume', form)
    return Promise.resolve({ data: { message: 'Resume upload placeholder', name: file.name } })
  },
}
