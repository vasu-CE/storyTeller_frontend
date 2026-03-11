import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function getApiUrl(path) {
  if (/^https?:\/\//.test(API_BASE_URL)) {
    return `${API_BASE_URL}${path}`
  }

  return `${window.location.origin}${API_BASE_URL}${path}`
}

export function getAnalyzeStreamUrl(repoUrl, options = {}) {
  const { forceSync = false } = options
  const url = new URL(getApiUrl('/analyze-stream'))
  url.searchParams.set('repoUrl', repoUrl)

  if (forceSync) {
    url.searchParams.set('forceSync', 'true')
  }

  return url.toString()
}

export async function sendChatMessage(sessionId, message, history) {
  try {
    const response = await axios.post(getApiUrl('/chat'), { sessionId, message, history })
    return response.data.reply
  } catch (error) {
    const messageText = error?.response?.data?.error || 'Request failed'
    throw new Error(messageText)
  }
}

export const repoSummaryClient = {
  /**
   * Fetch summary for a repository
   * @param {string} repoUrl - GitHub/GitLab repository URL
   * @returns {Promise<Object>} Analysis result
   */
  fetchSummary: async (repoUrl) => {
    try {
      const response = await axios.post(getApiUrl('/analyze'), { repoUrl })
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
      const response = await axios.get(getApiUrl('/health'))
      return response.data
    } catch (error) {
      return { status: 'error', message: error.message }
    }
  },

  listRepositories: async () => {
    try {
      const response = await axios.get(getApiUrl('/repositories'))
      return response.data.repositories || []
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to load stored repositories'
      throw new Error(message)
    }
  },
}
