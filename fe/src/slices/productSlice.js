// src/redux/slices/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { cloneDeep } from 'lodash'
import ProductService from '../services/productService'
export const create = createAsyncThunk('product/create', async (data, { rejectWithValue }) => {
  try {
    const { onSuccess } = data
    const payload = cloneDeep(data)
    delete payload.onSuccess
    const response = await ProductService.create(data)
    if (onSuccess) onSuccess(response.data)
    return response
  } catch (err) {
    return rejectWithValue(err.message || 'Error')
  }
})
export const get = createAsyncThunk('product/get', async (_, { rejectWithValue }) => {
  try {
    const response = await ProductService.get()
    return response.data
  } catch (err) {
    return rejectWithValue(err.message || 'Error')
  }
})
export const getById = createAsyncThunk('product/getById', async (data, { rejectWithValue }) => {
  try {
    const { onSuccess, id } = data
    const payload = cloneDeep(data)
    delete payload.onSuccess
    const response = await ProductService.getById(id)
    if (onSuccess) onSuccess(response.data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.message || 'Error')
  }
})

const initialState = {
  products: null,
  product: null
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.loading = true
      })
      .addCase(create.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(create.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(get.pending, (state) => {
        state.loading = true
      })
      .addCase(get.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(get.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getById.pending, (state) => {
        state.loading = true
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(getById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})


export default productSlice.reducer
