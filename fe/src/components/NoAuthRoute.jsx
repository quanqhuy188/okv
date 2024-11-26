// src/components/NoAuthRoute.js
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NoAuthRoute = () => {
  const { isAuth } = useSelector((state) => state.auth)


  if (isAuth) {
    return <Navigate to='/' replace />
  }

  return <Outlet /> 
}

export default NoAuthRoute
