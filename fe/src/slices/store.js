import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'
import product from './productSlice'
const store = configureStore({
  reducer: {
    auth: auth,
    product: product
  }
})

export default store
