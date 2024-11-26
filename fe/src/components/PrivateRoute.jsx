import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

const PrivateRoute = () => {
  const { isAuth } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mô phỏng việc load dữ liệu từ localStorage hoặc Redux
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      // Cập nhật trạng thái isAuth nếu có token
      setLoading(false) // Xác định trạng thái đã được load xong
    } else {
      setLoading(false) // Không có accessToken thì cũng xác định load xong
    }
  }, [])

  // Trong thời gian loading, không render gì cả
  if (loading) {
    return null // Hoặc có thể trả về một spinner/loading component
  }

  // Sau khi đã xác định được trạng thái, kiểm tra nếu isAuth là true
  if (!isAuth) {
    return <Navigate to='/login' replace />
  }

  return <Outlet /> // Nếu đã đăng nhập, render các route con
}

export default PrivateRoute
