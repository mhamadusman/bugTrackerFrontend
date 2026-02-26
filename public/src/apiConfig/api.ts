import axios from 'axios'

export const api = axios.create({
  baseURL: "/api", 
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true

      if (originalRequest.url?.includes('/auth/refresh-token')) {
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      try {
        await axios.post(`/api/auth/refresh-token`, {}, { withCredentials: true })

        return api(originalRequest)
      } catch (refreshError) {
       window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
