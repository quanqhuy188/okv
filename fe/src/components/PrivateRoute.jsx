import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

const PrivateRoute = () => {
  const { isAuth } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {

      setLoading(false) 
    } else {
      setLoading(false) 
    }
  }, [])

  
  if (loading) {
    return null 
  }

 
  if (!isAuth) {
    return <Navigate to='/login' replace />
  }

  return <Outlet /> 
}

export default PrivateRoute
