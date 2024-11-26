// src/redux/slices/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthService from '../services/auth/authService'
import { cloneDeep } from 'lodash'
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const { onSuccess } = data
    const payload = cloneDeep(data)
    delete payload.onSuccess
    const response = await AuthService.register(data)
    if (onSuccess) onSuccess(response.data?.result)
    return response.data
  } catch (err) {
    return rejectWithValue(err.message || 'Error')
  }
})
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const { onSuccess } = data
    const payload = cloneDeep(data)
    delete payload.onSuccess
    const response = await AuthService.login(data)
    if (onSuccess) onSuccess(response.data?.result)
    return response.data
  } catch (err) {
    return rejectWithValue(err.message || 'Error')
  }
})

const initialState = {
  data: null,
  user: null, // Thông tin người dùng
  accessToken: null, // Access token
  refreshToken: null, // Refresh token
  isAuth: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action để lưu thông tin người dùng và token khi đăng nhập thành công
    setAuth: (state, action) => {
      state.isAuth = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

// Export các action
export const { setAuth } = authSlice.actions

// Export reducer để sử dụng trong store
export default authSlice.reducer
