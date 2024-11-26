// src/components/NoAuthRoute.js
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NoAuthRoute = () => {
  const { isAuth } = useSelector((state) => state.auth)

  // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
  if (isAuth) {
    return <Navigate to='/' replace />
  }

  return <Outlet /> // Nếu chưa đăng nhập, render các route con (login/register)
}

export default NoAuthRoute
