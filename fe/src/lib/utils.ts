export const getAccessTokenFromLocalStorage = () => localStorage.getItem('accessToken')
export const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refreshToken')
export const setAccessTokenToLocalStorage = (value) => localStorage.setItem('accessToken', value)
export const setRefreshTokenToLocalStorage = (value) => localStorage.setItem('refreshToken', value)
export const removeTokensFromLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
