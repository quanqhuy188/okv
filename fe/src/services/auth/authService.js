import { LOGIN_API, REGISTER_API } from '../../constants'
import axiosClient from '../../lib/axiosClient'

const AuthService = {}

AuthService.register = function (data) {
  return axiosClient.post(REGISTER_API, data)
}
AuthService.login = function (data) {
  return axiosClient.post(LOGIN_API, data)
}
export default AuthService
