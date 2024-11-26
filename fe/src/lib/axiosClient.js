import axios from 'axios'
import { notification } from 'antd'
import { removeTokensFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from './utils'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_ENDPOINT_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Biến quản lý trạng thái refresh token
let isRefreshing = false
let failedQueue = []

// Hàm xử lý lại hàng đợi request khi refresh token thành công
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Thông báo lỗi với Ant Design notification
const showErrorNotification = (message, description) => {
  notification.error({
    message,
    description,
    placement: 'topRight'
  })
}

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    if (config.requiresAuth) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => {
    const { config, data } = response
    if (config.url === '/api/auth/register' || config.url === '/api/auth/login') {
      const accessToken = data?.accessToken
      const refreshToken = data?.refreshToken
      if (accessToken) setAccessTokenToLocalStorage(accessToken)
      if (refreshToken) setRefreshTokenToLocalStorage(refreshToken)
    }

    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true
          originalRequest._retry = true

          try {
            // Gửi yêu cầu làm mới token
            const refreshResponse = await axios.post(
              `${import.meta.env.VITE_PUBLIC_API_ENDPOINT_URL}api/auth/refresh-token`,
              { refreshToken }
            )
            const newAccessToken = refreshResponse.data.accessToken
            setAccessTokenToLocalStorage(newAccessToken)

            // Xử lý hàng đợi request chờ làm mới token
            processQueue(null, newAccessToken)

            // Cập nhật token vào headers
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axiosClient(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError, null)

            showErrorNotification('Session Expired', 'Your session has expired. Please log in again.')
            removeTokensFromLocalStorage()
            window.location.href = '/login'

            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }

        // Đưa request vào hàng đợi nếu đang làm mới token
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosClient(originalRequest)
          })
          .catch((queueError) => Promise.reject(queueError))
      } else {
        showErrorNotification('Authentication Required', 'Please log in to continue.')
        removeTokensFromLocalStorage()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    // Hiển thị thông báo lỗi từ backend
    if (error.response) {
      const { status, data } = error.response
      showErrorNotification(`Error ${status}`, data?.message || 'An unexpected error occurred')

      return Promise.reject({
        success: false,
        status,
        message: data?.message || 'An unexpected error occurred',
        data: data?.errors || null
      })
    }

    // Xử lý lỗi mạng hoặc lỗi không xác định
    showErrorNotification('Network Error', 'Unable to connect to the server. Please try again later.')

    return Promise.reject({
      success: false,
      status: 0,
      message: 'Network error or unable to connect to server'
    })
  }
)

export default axiosClient