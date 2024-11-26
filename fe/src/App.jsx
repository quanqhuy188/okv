// src/App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Product from './pages/Product'
import PrivateRoute from './components/PrivateRoute'
import { setAuth } from './slices/authSlice'
import NoAuthRoute from './components/NoAuthRoute'
import ProductList from './pages/ProductList'
import { jwtDecode } from 'jwt-decode'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      console.log(decoded)
      dispatch(setAuth(true)) // Cập nhật Redux
    } else {
      dispatch(setAuth(false)) // Cập nhật Redux
    }
  }, [dispatch])
  return (
    <Router>
      <Routes>
        <Route element={<NoAuthRoute />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Route>

        {/* Bảo vệ toàn bộ Layout với PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<ProductList />} />
          <Route path='/product/:id' element={<Product />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
