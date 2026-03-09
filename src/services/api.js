import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const repoSummaryClient = {
  /**
   * Fetch summary for a repository
   * @param {string} repoUrl - GitHub/GitLab repository URL
   * @returns {Promise<Object>} Analysis result
   */
  fetchSummary: async (repoUrl) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, { repoUrl })
      return response.data
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to fetch summary'
      throw new Error(message)
    }
  },

  /**
   * Check backend health
   * @returns {Promise<Object>}
   */
  checkHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      return response.data
    } catch (error) {
      return { status: 'error', message: error.message }
    }
  },
}
