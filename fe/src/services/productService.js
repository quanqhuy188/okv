import { CREATE_PRODUCT_API, GET_PRODUCT_API, GET_PRODUCT_ID_API } from '../constants'
import axiosClient from '../lib/axiosClient'

const ProductService = {}

ProductService.create = function (data) {
  return axiosClient.post(CREATE_PRODUCT_API, data, { requiresAuth: true })
}
ProductService.get = function () {
  return axiosClient.get(GET_PRODUCT_API, { requiresAuth: true })
}
ProductService.getById = function (data) {
  return axiosClient.get(`${GET_PRODUCT_ID_API}?id=${data}`, { requiresAuth: true })
}

export default ProductService
